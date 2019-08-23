import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

export interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 're-crm';

  vendedor = '';
  login = false;
  alert = '';

  equipos: Select[] = [];
  grupos: Select[] = [];
  campanas: Select[] = [];
  medios: Select[] = [];
  origenes: Select[] = [];

  constructor() {}

  public ngOnInit(): void {
    this.odooConnect('http://157.230.61.194:8070/xmlrpc',
    this.getUrlParameter('db'),
    this.getUrlParameter('user'),
    this.getUrlParameter('pass'));
  }

  public odooConnect(server: string, db: string, user: string, pass: string): void {
    const forcedUserValue = $.xmlrpc.force('string', user);
    const forcedPasswordValue = $.xmlrpc.force('string', pass);
    const forcedDbNameValue = $.xmlrpc.force('string', db);

    $.xmlrpc({
      url: server + '/common',
      methodName: 'login',
      dataType: 'xmlrpc',
      crossDomain: true,
      params: [forcedDbNameValue, forcedUserValue, forcedPasswordValue],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response + ' - ' + status);
        if (response[0] !== false) {
          console.log(response[0]);
          this.getData('http://157.230.61.194:8070/xmlrpc', db, pass, response[0]);
        } else {
          console.log('Err');
          this.login = false;
          this.alert = 'No está autorizado para acceder. Consulte al administrador.';
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Err: ' + jqXHR + ' - ' + status + '-' + error);
        this.login = false;
        this.alert = 'No está autorizado para acceder. Consulte al administrador.';
      }
    });
  }

  public getData(server: string, db: string, pass: string, uid: number): void {
    const reUser = this.getUrlParameter('user');

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'res.users', 'search', [ [['login', '=', reUser]] ], {limit: 1}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        $.xmlrpc({
          url: server + '/2/object',
          methodName: 'execute_kw',
          crossDomain: true,
          params: [db, uid, pass, 'res.users', 'read', [response[0]], {fields: ['franchise_id', 'name']}],
          success: (uresponse: any, ustatus: any, ujqXHR: any) => {
            console.log(uresponse);
            if (uresponse[0][0]) {
              this.vendedor = uresponse[0][0].name;
              this.login = true;
            } else {
              this.login = false;
              this.alert = 'No está autorizado para acceder. Consulte al administrador.';
            }
          },
          error: (ujqXHR: any, ustatus: any, uerror: any) => {
            console.log('Error : ' + uerror );
            this.login = false;
            this.alert = 'No está autorizado para acceder. Consulte al administrador.';
          }
        });
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'crm.team', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this.equipos[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'crm.team.group', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this.grupos[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });

    //////////////////////////////////////////////////////////////////////////////////////////

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'utm.campaign', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this.campanas[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'utm.medium', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this.medios[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'utm.source', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this.origenes[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });
  }

  public writeCrm(server: string, db: string, pass: string, uid: number): void {

  }

  /* Tools */

  public getUrlParameter(sParam: any): any {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    let sParameterName;
    let i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
  }
}
