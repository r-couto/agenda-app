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

  constructor(
    private service: ContatoService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  ngOnInit(): void {
  }
  
  submit() {
    console.log(this.formulario.value);
    // const c: Contato = new Contato();
    // c.nome = 'Fulano';
    // c.email = 'fulano@email.com';
    // c.favorito = false;
  
    // this.service.save(c).subscribe( resposta => {
    //   console.log(resposta)
    // });
  }

}
