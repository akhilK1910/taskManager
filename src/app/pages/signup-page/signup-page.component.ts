import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  constructor(private authService:AuthService){}
  onSignupButtonClicked(email:string,pw:string){
    this.authService.signup(email,pw).subscribe((res)=>{
      console.log(res);
    });
  }
}
