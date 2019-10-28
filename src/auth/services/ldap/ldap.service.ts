import { Injectable } from '@nestjs/common';
import { LoginRequestModel } from 'src/auth/models/login.request.model';
import { LoginResponseModel } from 'src/auth/models/login.response.model';
const ldap = require('ldapjs');
@Injectable()
export class LdapService {
  config = {};

  client = ldap.createClient({
    url: this.config.serverUrl,
    reconnect: true,
  });

  public async auth(
    credentials: LoginRequestModel,
  ): Promise<LoginResponseModel> {
    this.client.on('error', err => {
      console.log(err);
    });
    const filter = await this.getFilter(credentials.username);
    const user = await this.search(filter, credentials.password);
    const result = user[0];
    result.attributes = result.attributes.map(el => ({
      type: el.type,
      data: this.stringFromUTF8Array(el._vals[0]),
    }));

    const data: LoginResponseModel = this.mapToSendOnClient(result.attributes);
    return data;
  }

  private mapToSendOnClient(
    attributes: { type: string; data: string }[],
  ): LoginResponseModel {
    return {
      userName: attributes.find(el => el.type === 'cn').data,
      location: attributes.find(el => el.type === 'l').data,
      position: attributes.find(el => el.type === 'title').data,
      whenCreated: attributes.find(el => el.type === 'whenCreated').data,
      email: attributes.find(el => el.type === 'userPrincipalName').data,
      telNumber: attributes.find(el => el.type === 'mobile').data,
      physicalDeliveryOfficeName: attributes.find(
        el => el.type === 'physicalDeliveryOfficeName',
      ).data,
    };
  }

  private getFilter(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.bind(this.config.readerDn, this.config.readerPwd, err => {
        if (err) {
          reject('Reader bind failed ' + err);
          return;
        }
        resolve(
          `(&(userPrincipalName=${username})(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`,
        );
      });
    });
  }

  private search(filter: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.search(
        this.config.suffix,
        {
          filter,
          scope: 'sub',
        },
        (err, searchRes) => {
          var searchList = [];

          searchRes.on('searchEntry', entry => {
            searchList.push(entry);
          });

          searchRes.on('error', entry => {
            console.log('error');
          });

          searchRes.on('end', retVal => {
            if (!searchList.length) {
              reject({ user: null });
            }

            for (let i = 0; i < searchList.length; i++)
              this.client.bind(searchList[0].objectName, password, err => {
                if (err) {
                  reject({ user: null });
                } else {
                  resolve(searchList);
                }
              });
          });
        },
      );
    });
  }

  private stringFromUTF8Array(data) {
    const atributtes = [...data];
    const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
    var count = atributtes.length;
    var str = '';

    for (var index = 0; index < count; ) {
      var ch = data[index++];
      if (ch & 0x80) {
        var extra = extraByteMap[(ch >> 3) & 0x07];
        if (!(ch & 0x40) || !extra || index + extra > count) return null;

        ch = ch & (0x3f >> extra);
        for (; extra > 0; extra -= 1) {
          var chx = data[index++];
          if ((chx & 0xc0) != 0x80) return null;

          ch = (ch << 6) | (chx & 0x3f);
        }
      }

      str += String.fromCharCode(ch);
    }

    return str;
  }
}
