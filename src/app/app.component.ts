/* Re-CRM-APP */
import { Component, OnInit, ViewChild } from '@angular/core';
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

  uid = 0;
  serverUrl = 'http://157.230.61.194:28069/xmlrpc';

  vendedor = '';
  @ViewChild('name', {static: false}) name: any;
  @ViewChild('notes', {static: false}) notes: any;
  @ViewChild('contact', {static: false}) contact: any;
  @ViewChild('email', {static: false}) email: any;
  @ViewChild('mobile', {static: false}) mobile: any;
  @ViewChild('phone', {static: false}) phone: any;

  type = '';
  typeOpp = '';
  campan = '';
  media = '';
  origin = '';
  team = '';
  group = '';

  login = false;
  alert = '';
  success = false;
  op_id = 0;

  equipos: Select[] = [];
  grupos: Select[] = [];
  campanas: Select[] = [];
  medios: Select[] = [];
  origenes: Select[] = [];

  tags = [];
  tagsList = [];
  depLess50 = false;
  depMore50 = false;
  gAlta = false;
  gBaja = false;
  gMedia = false;
  premium = false;
  cerramiento = false;
  cimiento = false;
  construccion = false;
  mamposteria = false;
  noIniciada = false;
  remodelacion = false;
  cocinas = false;
  estar = false;
  lavadero = false;
  placares = false;
  vanitory = false;
  vestidor = false;
  madera = false;
  melamina = false;
  polimero = false;
  vidrio = false;

  constructor() {}

  public ngOnInit(): void {
    this.odooConnect(this.serverUrl,
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
          this.uid = response[0];
          this.getData(this.serverUrl, db, pass, response[0]);
        } else {
          console.log('Err');
          this.login = false;
          this.alert = 'No está autorizado para acceder. Consulte al administrador.';
        }
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Err: ' + jqXHR + ' - ' + status + '-' + error);
        console.log(jqXHR);
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
          params: [db, uid, pass, 'res.users', 'read', [response[0]], {fields: ['franchise_id', 'default_operating_unit_id', 'operating_unit_ids', 'name']}],
          success: (uresponse: any, ustatus: any, ujqXHR: any) => {
            console.log('USER:', uresponse);
            if (uresponse[0][0]) {
              this.vendedor = uresponse[0][0].name;
              this.op_id = uresponse[0][0].default_operating_unit_id[0];
              /*for (let i = 0; i < uresponse[0][0].operating_unit_ids.length; i++) {
                this.grupos.push( {value: response[0][i].id, viewValue: response[0][i].name} );
              }*/
              this.login = true;
            } else {
              this.login = false;
              this.alert = 'No está autorizado para acceder. Consulte al administrador.';
            }

            for (let i = 0; i <= uresponse[0][0].operating_unit_ids.length; i++) {
              $.xmlrpc({
                url: server + '/2/object',
                methodName: 'execute_kw',
                crossDomain: true,
                params: [db, uid, pass, 'crm.team', 'search_read', [ [['operating_unit_id', '=', uresponse[0][0].operating_unit_ids[i]]] ], {fields: ['name', 'id']}],
                success: (response: any, status: any, jqXHR: any) => {
                  for (let i = 0; i < response[0].length; i++) {
                    this.equipos.push( {value: response[0][i].id, viewValue: response[0][i].name} );
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
                params: [db, uid, pass, 'operating.unit', 'search_read', [ [['id', '=', uresponse[0][0].operating_unit_ids[i]]] ], {fields: ['name', 'id']}],
                success: (response: any, status: any, jqXHR: any) => {
                  if (response[0][0]) {
                    this.grupos.push( {value: response[0][0].id, viewValue: response[0][0].name} );
                  }
                },
                error: (jqXHR: any, status: any, error: any) => {
                  console.log('Error : ' + error );
                }
              });
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

    /*$.xmlrpc({
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
    });*/

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
        console.log('Error: ', error);
      }
    });

    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'crm.lead.tag', 'search_read', [ [] ], {fields: ['name', 'id']}],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        this.tags = response[0];
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error: ', error);
      }
    });
  }

  public writeCrm(server: string, db: string, pass: string): void {
    $.xmlrpc({
      url: server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, this.uid, pass, 'crm.lead', 'create', [{
        type: this.type,
        name: this.name.nativeElement.value,
        contact_name: this.contact.nativeElement.value,
        email_from: this.email.nativeElement.value,
        mobile: this.mobile.nativeElement.value,
        phone: this.phone.nativeElement.value,
        description: this.notes.nativeElement.value,
        team_id: this.team,
        operating_unit_id: this.group,
        lead_category: this.typeOpp,
        campaign_id: this.campan,
        medium_id: this.media,
        source_id: this.origin,
        tag_ids: [[6, 0, this.tagsList]]
      }]],
      success: (response: any, status: any, jqXHR: any) => {
        console.log(response);
        this.success = true;
      },
      error: (jqXHR: any, status: any, error: any) => {
        console.log('Error : ' + error );
      }
    });
  }

  /* SENDER */

  public send(): void {
    console.log('- - - - - - Writting - - - - - -');
    console.log('Tipo: ' + this.type);
    console.log('Equipo: ' + this.team);
    console.log('Grupo: ' + this.group);
    console.log('Nombre: ' + this.name.nativeElement.value);
    console.log('Campaña: ' + this.campan);
    console.log('Medio: ' + this.media);
    console.log('Origen: ' + this.origin);
    console.log('Nombre de Contacto: ' + this.contact.nativeElement.value);
    console.log('Email: ' + this.email.nativeElement.value);
    console.log('Celular: ' + this.mobile.nativeElement.value);
    console.log('Tel: ' + this.phone.nativeElement.value);
    console.log('Tipo de Oportunidad: ' + this.typeOpp);
    console.log('Notas: ' + this.notes.nativeElement.value);

    if (this.depLess50) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', '-50 Departamentos')].id); }//
    if (this.depMore50) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', '+50 Departamentos')].id); }//
    if (this.gAlta) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Gama Alta')].id); }//
    if (this.gBaja) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Gama Baja')].id); }//
    if (this.gMedia) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Gama Media')].id); }//
    if (this.premium) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Premium')].id); }//
    if (this.cerramiento) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Cerramiento')].id); }//
    if (this.cimiento) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Cimiento')].id); }//
    if (this.construccion) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Construccion')].id); }//
    if (this.mamposteria) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Mamposteria')].id); }//
    if (this.noIniciada) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'No Iniciada')].id); }//
    if (this.remodelacion) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Remodelacion')].id); }//
    if (this.cocinas) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Cocinas')].id); }//
    if (this.estar) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Estar')].id); }//
    if (this.lavadero) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Lavadero')].id); }//
    if (this.placares) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Placares')].id); }//
    if (this.vanitory) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Vanitory')].id); }//
    if (this.vestidor) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Vestidor')].id); }//
    if (this.madera) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Madera')].id); }//
    if (this.melamina) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Melamina')].id); }//
    if (this.polimero) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Polimero')].id); }//
    if (this.vidrio) {this.tagsList.push(this.tags[this.findWithAttr(this.tags, 'name', 'Vidrio')].id); }//

    this.writeCrm(this.serverUrl,
    this.getUrlParameter('db'),
    this.getUrlParameter('pass'));
  }

  /* Tools */

  public getUrlParameter(sParam: any): any {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    let sParameterName: any;
    let i: number;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
  }

  public findWithAttr(array: any, attr: any, value: any) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }
}
