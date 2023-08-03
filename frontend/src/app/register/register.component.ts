import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  file: string = '';
  file_oup: File;
  file_extension :string = '';
  constructor(private userService: UserService, private router: Router) {
    $(document).ready(() => {
      $('.redirect').on('click', () => {
        this.router.navigate(['']);
      });

      $('.help span').click(function () {
        $('.help-background').addClass('help-active');
      });

      $('.help-next span').click(function () {
        $('.help-background').removeClass('help-active');
      });

      //Remove red border
      $('.input-box input').click(function () {
        $(this).parent().removeClass('input-box-empty');
      });

      //Display the popup
      $('.bottom-next').click(function () {
        $('.popup-background').removeClass('popup-active');
      });
    });
  }

  ngOnInit(): void {}

  registerUser() {
    let flag = 0;
    let error_message = '';

    //Check if input types are empty
    let inputs = $('.input-box input');
    inputs.each(function () {
      // chechk for empty fileds
      if (!$(this).val()) {
        $(this).parent().addClass('input-box-empty');
        flag++;
      }
    });

    if (flag) {
      // if empty filed raise error 
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text("Sorry you can't sign up...");
      $('.bottom-message span').text('You must fill marked fields first!');
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
    } else {
      //Check if input types are correct
      let regex_username = /^[a-zA-Z]\w*$/;
      let regex_name = /^[A-Z][a-z]{1,15}/;
      let regex_surname = /^[A-Z][a-z]{1, 15}/;
      let regex_password_length = /^.{6,}/;
      let regex_password_lowercase = /[a-z]/;
      let regex_password_uppercase = /[A-Z]/;
      let regex_password_number = /[0-9]/;
      let regex_password_special = /[!@#$%^&*]/;
      let regex_email = /^\w+@[a-z]+\.[a-z]{2,3}$/;
      let regex_mobail = /^(?:\+381|06)\d*$/;

      let username = $('#username').val() as string;
      let name = $('#name').val() as string;
      let surname = $('#surname').val() as string;
      let email = $('#email').val() as string;
      let mobile = $('#phone').val() as string;
      let password = $('#password').val() as string;
      let password_confirm = $('#password_confirm').val() as string;
      let street = $('#address').val() as string;
      let incorrect_password = false;

      // validate user input
      if (regex_username.test(username) == false) {
        error_message += 'Username does not have the correct form\n';
        $('#username').parent().addClass('input-box-empty');
      }
      if (regex_username.test(street) == false) {
        error_message += 'Address does not have the correct form\n';
        $('#address').parent().addClass('input-box-empty');
      }
      if (regex_name.test(name) == false) {
        error_message += 'Name does not have the correct form\n';
        $('#name').parent().addClass('input-box-empty');
      }
      if (regex_name.test(surname) == false) {
        error_message += 'Surname does not have the correct form\n';
        $('#surname').parent().addClass('input-box-empty');
      }
      if (regex_email.test(email) == false) {
        error_message += 'Email does not have the correct form\n';
        $('#email').parent().addClass('input-box-empty');
      }
      if (regex_mobail.test(mobile) == false) {
        error_message += 'Phone number does not have the correct form\n';
        $('#phone').parent().addClass('input-box-empty');
      }

      if (regex_password_length.test(password) == false) {
        error_message += 'Password does not have the correct length\n';
        incorrect_password = true;
      }
      if (regex_password_lowercase.test(password) == false) {
        error_message +=
          'Password must contain at least one lowercase character\n';
        incorrect_password = true;
      }
      if (regex_password_uppercase.test(password) == false) {
        error_message +=
          'Password must contain at least one uppercase character\n';
        incorrect_password = true;
      }
      if (regex_password_number.test(password) == false) {
        error_message += 'Password must contain at least one number\n';
        incorrect_password = true;
      }
      if (regex_password_special.test(password) == false) {
        error_message +=
          'Password must contain at least one special character\n';
        incorrect_password = true;
      }
      if (password.length < 8 || password.length > 14) {
        error_message += 'Password length must be between 8-14\n';
        incorrect_password = true;
      }

      for (let i = 0; i < password.length - 1; i++) {
        if (password[i] == password[i + 1]) {
          error_message +=
            "Password can't have two of the same successive characters\n";
          incorrect_password = true;
          break;
        }
      }

      if (incorrect_password) {
        $('#password').parent().addClass('input-box-empty');
      } else {
        if (password != password_confirm) {
          $('#password').parent().addClass('input-box-empty');
          $('#password_confirm').parent().addClass('input-box-empty');
          error_message += 'Passwords do not match\n';
        }
      }

      if (error_message.length != 0) {
        $('.popup-top').removeClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text("Sorry you can't sign up...");
        $('.bottom-message span').text(error_message);
        $('.bottom-next span').text('Return to the form');
        $('.popup-background').addClass('popup-active');
      } else {
        // preparing payload for server 
        const data_package = {
          username: username,
          name: name,
          surname: surname,
          email: email,
          mobile: mobile,
          password: password,
          street: street,
        };
        this.userService.register(data_package).subscribe((response) => {
          // error caused by 1)user alredy exists or server side error
          if (response['status'] == 400) {
            error_message = response['error_message'];
            $('.popup-top').removeClass('success');
            $('.top-image img').attr(
              'src',
              '../../assets/icons/MedCent Exclamation.svg'
            );
            $('.top-message span').text("Sorry you can't sign up...");
            $('.bottom-message span').text(error_message);
            $('.bottom-next span').text('Return to the form');
            $('.popup-background').addClass('popup-active');
            if (response['casue'] == 'Trying to add user that exists') {
              $('#username').parent().addClass('input-box-empty');
            }
          } else {
            //no errors user is register 
            $('.popup-top').addClass('success');
            $('.top-image img').attr(
              'src',
              '../../assets/icons/MedCent CheckMark.svg'
            );
            $('.top-message span').text('You have signed up successfully!');
            $('.bottom-message span').text(
              'Thank you for choosing the MedCent'
            );
            $('.bottom-next span').text(
              'You will be redirected to Log In page'
            );

            $('.popup-background').addClass('popup-active');

            if (this.file.length > 0) {
              var form_data = new FormData();
              var oFReader = new FileReader();

              this.userService.upload_img(this.file, this.file_extension).subscribe((response) => {

                if(response['status']==200){
                  // picture is added redirect user to login page
                  setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 4000);


                }else{
                  // error acured when adding use profile picture
                  $('.popup-top').removeClass('success');
                  $('.top-image img').attr(
                    'src',
                    '../../assets/icons/MedCent Exclamation.svg'
                  );
                  $('.top-message span').text("Sorry you can't sign up...");
                  $('.bottom-message span').text(error_message);
                  $('.bottom-next span').text('Return to the form');
                  $('.popup-background').addClass('popup-active');
                }

              });
            } else {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 4000);
            }
          }
        });
      }
    }
  }
  errorMessage: string;

  onFileChange(event: any): void {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const file = files[0];
      const _file = URL.createObjectURL(files[0]);
      if (this.validateFileExtension(this.getFileExtension(files[0]['type']))) {
        this.checkImageDimensions(_file, (dim_stmt) => {
          if (
            this.validateFileExtension(this.getFileExtension(file['type'])) &&
            dim_stmt
          ) {
            this.file = _file;
            this.resetInput();
          }
        });
      }
    }
  }

  checkImageDimensions(imageSrc, callback) {
    const img = new Image();

    img.onload = function () {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const dim_stmt =
        (width === 100 && height === 100) || (width === 300 && height === 300);
      callback(dim_stmt);
    };

    img.onerror = function () {
      callback(false);
    };

    img.src = imageSrc;
  }

  validateFileExtension(extension: string): boolean {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    if (allowedExtensions.includes(extension)) {
      this.file_extension = extension
      return true;
    } else {
      return false;
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('/')[1];
  }

  resetInput(): void {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
