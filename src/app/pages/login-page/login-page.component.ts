import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(private authService:AuthService,private router:Router){}

  onLoginButtonClicked(email:string,pw:string){
    this.authService.login(email,pw).subscribe((res)=>{
      if(res.status===200){
        this.router.navigate(['/lists']);
      }
      console.log(res);
    });
  }
}
