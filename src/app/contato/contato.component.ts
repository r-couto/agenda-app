import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

import { ContatoDetalheComponent } from "../contato-detalhe/contato-detalhe.component";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[];
  colunas: String[];

  totalElementos: number = 0;
  pagina: number = 0;
  tamanho: number = 3;

  pageSizeOptions: number[] = [3];

  constructor( 
    private service: ContatoService, 
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {

    this.formulario = new FormGroup({});
    this.contatos = [];
    this.colunas = ['foto', 'id', 'nome', 'email', 'favorito'];

  }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  listarContatos(pagina: number = 0, tamanho: number = 10) {
    this.service.list(pagina, tamanho).subscribe(respota => {
      this.contatos = respota.content;
      this.totalElementos = respota.totalElements;
      this.pagina = respota.number;
    });
  }

  favoritar(contato: Contato) {
    this.service.favorite(contato).subscribe(resposta => {
      contato.favorito = !contato.favorito;
    });
  }
  
  submit() {
    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(contato).subscribe( resposta => {
      this.listarContatos(this.pagina, this.tamanho);
      this.resetFormulario();
      this.snackBar.open('O Contato foi adicionado!', 'Sucesso!', { 
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }

  resetFormulario() {
    this.formulario.reset();
    this.formulario.controls['nome'].setErrors(null);
    this.formulario.controls['email'].setErrors(null);
  }

  uploadFoto(event: any, contato: Contato) {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service
            .upload(contato, formData)
            .subscribe(resposta => this.listarContatos(this.pagina, this.tamanho));
    }
  }

  visualizarContato(contato: Contato) {
    this.dialog.open( ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    });
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho);
  }

}
