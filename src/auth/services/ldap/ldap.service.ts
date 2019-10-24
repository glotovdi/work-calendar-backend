import { Injectable } from '@nestjs/common';
import { LoginRequestModel } from 'src/auth/models/login.request.model';
const ldap = require('ldapjs');
@Injectable()
export class LdapService {
  config = {};

  client = ldap.createClient({
    url: this.config.serverUrl,
  });

  public async auth(credentials: LoginRequestModel): Promise<any> {
    const filter = await this.getFilter(credentials.username);
    const result = await this.search(filter, credentials.password);

    return result;
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

          searchRes.on('end', retVal => {
            if (!searchList.length) {
              reject({ user: null });
            }

            for (let i = 0; i < searchList.length; i++)
              this.client.bind(searchList[0].objectName, password, err => {
                if (err) {
                  reject({ user: null });
                } else {
                  resolve({ user: searchList[0].objectName });
                }
              });
          });
        },
      );
    });
  }
}
