import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[];
  colunas: String[];

  constructor( private service: ContatoService, private fb: FormBuilder ) {
    this.formulario = new FormGroup({});
    this.contatos = [];
    this.colunas = ['id', 'nome', 'email', 'favorito'];
  }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  listarContatos() {
    this.service.list().subscribe(respota => {
      this.contatos = respota;
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
      this.contatos.push(resposta);
      this.resetFormulario();  
    });
  }

  resetFormulario() {
    this.formulario.reset();
    this.formulario.controls['nome'].setErrors(null);
    this.formulario.controls['email'].setErrors(null);
  }

}
