import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  responseLogin: any;


  submitForm(): void {
    const userName = this.validateForm.get('userName')!.value;
    const password = this.validateForm.get('password')!.value;

    if (this.validateForm.valid) {
      this.authService.login(userName, password)
      .subscribe({
        next: (v) => this.processarSucesso(v),
        error: (e) => this.processarFalha(e),
        complete: () => console.info('complete')
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  processarSucesso(response: any) {
    this.responseLogin = response;
    this.authService.LocalStorage.salvarDadosLocaisUsuario(response);
    //fazer a api autenticar retornar os dados do usuario que precisam ser gravados

  }

  processarFalha(fail: any) {
    //this.loading = false;
    if (fail.error) {
      if (fail.error.errors.Senha) {
        for (let erro of fail.error.errors.Senha) {
          console.log('erro 1')
          //notify(erro, 'error', 3000);
        }
      }

      if (fail.error.errors.Mensagens) {
        for (let erro of fail.error.errors.Mensagens) {
          //notify(erro, 'error', 3000);
          console.log('erro 2')
        }
      }
    } else {
      //notify(fail, 'error', 3000);
      console.log('erro 3')
    }


  }


  constructor(
    private fb: NonNullableFormBuilder,
    private authService : AuthService
  ) {}
}
