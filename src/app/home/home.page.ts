import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cepInfor: Observable<any> | undefined;
  enderecoInfo: Observable<any> | undefined;

  cep: any;

  rua:any;
  bairro:any;
  cidade:any;
  estado:any;

  uf:any;
  localidade:any;
  logradouro:any;
  
  resultadoCEP:any = [];


  constructor(private router: Router, private http: HttpClient, public ToastController: ToastController) { }

  consultarCEP(cep:string):void {
    this.cepInfor = this.http.get('https://viacep.com.br/ws/' + cep + '/json/').pipe(catchError(erro => this.exibirErro(erro)));
    this.cepInfor.subscribe((x) => {this.rua = x.logradouro});
    this.cepInfor.subscribe((x) => {this.bairro = x.bairro});
    this.cepInfor.subscribe((x) => {this.cidade = x.localidade});
    this.cepInfor.subscribe((x) => {this.estado = x.uf});
  }

  consultarEndereco(uf:string, localidade:string, logradouro:string):void {
    this.enderecoInfo = this.http.get('https://viacep.com.br/ws/' + uf +'/'+ localidade +'/'+ logradouro + '/json/').pipe(catchError(erro => this.exibirErro(erro)));
    this.enderecoInfo.subscribe((x) => {console.log(x)});
    this.enderecoInfo.subscribe((x) => {for(let i = 0; i < x.length; i++){this.resultadoCEP[i] = x[i].cep + ', ' + x[i].complemento + ' ' +  x[i].logradouro}});
  }

  async exibirErro(erro:any){
    const toast = await this.ToastController.create({
      message: 'erro ao consultar a API: ' + erro.status + ': ' + erro.message,
      duration: 4000,
      color: 'danger',
      position: 'middle'
    });
    console.log(erro);
    toast.present();
    return null;
  }
}
