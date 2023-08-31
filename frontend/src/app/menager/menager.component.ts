import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenagerService } from '../services/menager.service';
import { UserManagerData } from '../models/manager.user';
import { User } from '../models/user';
import * as $ from 'jquery';
import { cloneDeep } from 'lodash';
import { Location } from '@angular/common';
import { NewServicReciveData } from '../models/new_service_recive';
import { EditSpecServicData } from '../models/spec_serv_edit';
import { NewServicRequest } from '../models/new_servic';
import { Temp } from '../models/spec_temp';
import { ManagerServiceData } from '../models/managerservicdata';

@Component({
  selector: 'app-menager',
  templateUrl: './menager.component.html',
  styleUrls: ['./menager.component.css'],
})
export class MenagerComponent implements OnInit {
  constructor(
    private router: Router,
    private servic: MenagerService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  user_data: UserManagerData[] = [];
  selected_users: any[] = [];
  selected_user: UserManagerData;
  new_req_data: NewServicReciveData[] = [];
  user_requests: UserManagerData[] = [];
  spec_ser_edit: EditSpecServicData[] = [];

  dummy: NewServicRequest = new NewServicRequest();
  all_servecs: ManagerServiceData[] = [];
  all_spec: Temp[] = [];

  ngOnInit(): void {
    if (sessionStorage.getItem('user_token') == undefined) {
      this.router.navigate(['/manager/login']);
    }
    let token = sessionStorage.getItem('user_token');
    this.servic.getManagerFromToken(token).subscribe((data) => {
      if (data['status'] === 200) {
        
        if (data['user'].type !== 'Manager') this.router.navigate(['/']);
      }
    });

    this.servic.get_all_services().subscribe((data) => {
      let index = 0;
      this.all_servecs = data['data'].map((elem) => {
        return {
          id: elem._id,
          servic_name: elem.servic_name,
          index: index++,
        };
      });
      console.log(this.all_servecs);
    });

    $('.notifications img').click(function () {
      $('.dropdown-search').removeClass('active');
      $('.dropdown-options').removeClass('active');
      $('.dropdown-notifications').toggleClass('active');
    });

    this.servic.get_all_spec().subscribe((data) => {
      let i = 0;
      this.all_spec = data['data'].map((elem) => {
        return {
          name: elem.name,
          id: i++,
        };
      });
    });

    this.servic.get_all_user_data().subscribe((data: UserManagerData[]) => {
      if (data['status'] === 200) {
        this.user_data = data['data'];

        this.user_data.forEach((elem) => {
          let imgP = elem.img_profile;
          const uint8Array = new Uint8Array(imgP['data']);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          elem.edit = false;
          elem.img_profile = null;
          elem.img_path = `data:image/png;base64,${base64String}`;
          elem.file = `data:image/png;base64,${base64String}`;
          elem.file_oup = null;
          elem.file_extension = '';
          elem.img_edit_status = false;
        });
      }
    });

    this.servic.get_all_requests_data().subscribe((data: UserManagerData[]) => {
      if (data['status'] === 200) {
        this.user_requests = data['data'];

        this.user_requests.forEach((elem) => {
          let imgP = elem.img_profile;
          const uint8Array = new Uint8Array(imgP['data']);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          elem.edit = false;
          elem.img_profile = null;
          elem.img_path = `data:image/png;base64,${base64String}`;
          elem.file = `data:image/png;base64,${base64String}`;
        });
      }
    });

    this.servic.get_all_new_service().subscribe((data) => {
      if (data['status'] === 200) {
        this.new_req_data = data['data'];
      }
    });

    $(document).ready(() => {
      $('#uid').hide();
      $('.users_view').on('click', () => {
        $('#uid').show();
        $('#sid').hide();
      });

      $('.services_view').on('click', () => {
        $('#uid').hide();
        $('#sid').show();
      });

      $('.bottom-next').click(function () {
        $('.popup-background').removeClass('popup-active');
      });

      $('.workoff_input').click(function () {
        $(this).removeClass('input-box-empty');
      });
      //Click on the dropdown menu
      $('.dropdown-select').on('click', function () {
        let span = $(this).find('.select-btn span');
        $(this).find('.select-btn').toggleClass('select-btn-clicked');
        $(this).find('.select-btn').removeClass('select-btn-empty');
        $(this).toggleClass('active');
      });
      //Click away from the dropdown menu
      $('.dropdown-select').on('focusout', function () {
        $(this).find('.select-btn').removeClass('select-btn-clicked');
        $(this).removeClass('active');
      });

      //Display the popup
      $('.bottom-next').click(function () {
        $('.popup-background').removeClass('popup-active');
      });
    });

    this.servic.get_all_spec_serv().subscribe((data) => {
      if (data['status'] === 200) {
        this.spec_ser_edit = data['data'];
      } else {
        console.log(data['error_message']);
      }
    });
  }

  edit_mode(user: UserManagerData) {
    user.edit = true;
    this.selected_user = cloneDeep(user);
    this.selected_users.push({
      key: user._id,
      data: this.selected_user,
    });
    console.log(this.selected_users);
  }
  view_mode(user: UserManagerData) {
    user.edit = false;
    this.selected_users = this.selected_users.filter(
      (obj) => obj.key !== user._id
    );
  }

  changeFocus(req: UserManagerData) {
    if (req.edit == true) {
      this.selected_user = this.selected_users.find(
        (obj) => obj.data._id === req._id
      )['data'];
    }
  }

  save_mode(req) {
    if (
      this.selected_user.file.length > 0 &&
      this.selected_user.img_edit_status
    ) {
      this.readImageFile(this.selected_user.file_oup).then((res) => {
        const data = res;
        this.servic.updateUser(this.selected_user, data).subscribe((data) => {
          if (data['status'] == 200) {
            console.log('stigo');
            this.selected_user.edit = false;
            this.selected_users = this.selected_users.filter(
              (obj) => obj.key !== req._id
            );
            if (data['cause'] !== 'no data was changed') {
              this.user_data = this.user_data.map((obj) => {
                if (obj._id === req._id) {
                  obj = data['return_data'];
                  obj.edit = false;
                  let imgP = data['return_data'].img_profile;
                  const uint8Array = new Uint8Array(imgP['data']);
                  const base64String = btoa(String.fromCharCode(...uint8Array));
                  obj.img_profile = null;
                  obj.img_path = `data:image/png;base64,${base64String}`;
                }
                return obj;
              });
            } else {
              req.edit = false;
            }
          } else {
            console.log(data['error_message']);
          }
        });
      });
    } else {
      const data = null;
      this.servic.updateUser(this.selected_user, data).subscribe((data) => {
        if (data['status'] == 200) {
          console.log('stigo');
          this.selected_user.edit = false;
          this.selected_users = this.selected_users.filter(
            (obj) => obj.key !== req._id
          );
          if (data['cause'] !== 'no data was changed') {
            this.user_data = this.user_data.map((obj) => {
              if (obj._id === req._id) {
                obj = data['return_data'];
                obj.edit = false;
              }
              return obj;
            });
          } else {
            req.edit = false;
          }
        } else {
          console.log(data['error_message']);
        }
      });
    }
  }

  getUser(req) {
    if (req.edit == true && this.selected_users.length > 0) {
      return this.selected_users.find((obj) => obj.data._id === req._id)[
        'data'
      ];
    }
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    let user = this.selected_user;
    if (files.length > 0) {
      const file = files[0];
      const _file = URL.createObjectURL(files[0]);
      if (
        this.validateFileExtension(
          this.getUser(user),
          this.getFileExtension(files[0]['type'])
        )
      ) {
        this.checkImageDimensions(_file, (dim_stmt) => {
          if (
            this.validateFileExtension(
              this.getUser(user),
              this.getFileExtension(file['type'])
            ) &&
            dim_stmt
          ) {
            this.getUser(user).file = _file;
            this.getUser(user).file_oup = files[0];
            this.getUser(user).img_edit_status = true;
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

  validateFileExtension(user, extension: string): boolean {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    if (allowedExtensions.includes(extension)) {
      user.file_extension = extension;
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

  readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        resolve(e.target.result);
      };

      reader.onerror = function (e) {
        reject(e.target.error);
      };

      reader.readAsDataURL(file);
    });
  }

  redirect(req) {
    localStorage.setItem('request', JSON.stringify(req));
    this.router.navigate(['/patient_view']);
  }

  accept(req: UserManagerData) {
    this.servic.update_status(req, 'true').subscribe((data) => {
      if (data['status'] == 200) {
        this.location.replaceState(this.location.path());
        window.location.reload();
      }
    });
  }
  decline(req: UserManagerData) {
    this.servic.update_status(req, 'decline').subscribe((data) => {
      if (data['status'] == 200) {
        this.location.replaceState(this.location.path());
        window.location.reload();
      }
    });
  }

  save_req_n(re, sp) {
    this.servic.aprove_requested_service(sp, re).subscribe((data) => {
      if (data['status'] === 200) {
        let index = this.new_req_data.findIndex(
          (elem) => elem.specializzazione === sp
        );
        let index2 = this.new_req_data[index].requests.findIndex(
          (elem) =>
            elem.service_name === re.service_name &&
            elem.servic_cost === re.servic_cost &&
            elem.service_dur === re.service_dur &&
            elem.service_des === re.service_des
        );
        this.new_req_data[index].requests.splice(index2, 1);
        this.cdr.detectChanges();
      } else {
        console.log(data['error_message']);
      }
    });
  }

  remove_req_n(re, sp) {
    this.servic.remove_requested_service(sp, re).subscribe((data) => {
      if (data['status'] === 200) {
        let index = this.new_req_data.findIndex(
          (elem) => elem.specializzazione === sp
        );
        let index2 = this.new_req_data[index].requests.findIndex(
          (elem) =>
            elem.service_name === re.service_name &&
            elem.servic_cost === re.servic_cost &&
            elem.service_dur === re.service_dur &&
            elem.service_des === re.service_des
        );
        this.new_req_data[index].requests.splice(index2, 1);
        this.cdr.detectChanges();
      } else {
        console.log(data['error_message']);
      }
    });
  }

  cancle_speres() {
    this.dummy = new NewServicRequest();
  }

  save_specsercedit(original, spec) {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (
      this.dummy.service_name === '' &&
      this.dummy.servic_cost == null &&
      !timeRegex.test(this.dummy.service_dur) &&
      this.dummy.service_des.trim() === ''
    ) {
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text("Sorry you can't submit...");
      $('.bottom-message span').text('Request filld must not be empty!');
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
      return;
    } else {
      if (this.dummy.service_name === '') {
        this.dummy.service_name = original.service_name;
      }
      if (
        this.dummy.servic_cost === null ||
        this.dummy.servic_cost === undefined
      ) {
        this.dummy.servic_cost = original.cost;
      }
      if (!timeRegex.test(this.dummy.service_dur)) {
        this.dummy.service_dur = '30:00';
      }
      if (
        this.dummy.service_des === undefined ||
        this.dummy.service_des.trim() === ''
      ) {
        this.dummy.service_des = original.description;
      }
      this.dummy.id = original.id;
      this.servic.gupdate_specser(this.dummy).subscribe((data) => {
        if (data['status'] === 200) {
          //
          if (data['data']) {
            let index = this.spec_ser_edit.findIndex(
              (elem) => elem.specializzazione === spec
            );
            let index2 = this.spec_ser_edit[index].all_services.findIndex(
              (elem) =>
                elem.service_name === original.service_name &&
                elem.cost == original.cost &&
                elem.description == original.description &&
                elem.time == original.time
            );

            this.spec_ser_edit[index].all_services[index2] = {
              id: data['data']._id,
              cost: data['data'].cost,
              description: data['data'].description,
              service_name: data['data'].servic_name,
              time: data['data'].time,
              edit: false,
            };
            this.dummy = new NewServicRequest();
            this.cdr.detectChanges();
            $('.popup-top').addClass('success');
            $('.top-image img').attr(
              'src',
              '../../assets/icons/MedCent Exclamation.svg'
            );
            $('.top-message span').text('You have eddit a service!');
            $('.bottom-message span').text(
              'Thank you for choosing the MedCent'
            );
            $('.bottom-next span').text('close');

            $('.popup-background').addClass('popup-active');
          } else {
            $('.popup-top').removeClass('success');
            $('.top-image img').attr(
              'src',
              '../../assets/icons/MedCent Exclamation.svg'
            );
            $('.top-message span').text('Sorry something whent wrong...');
            $('.bottom-message span').text('Request filld must not be empty!');
            $('.bottom-next span').text('Return to the form');
            $('.popup-background').addClass('popup-active');
            return;
          }
        }
      });
    }
  }

  remove_speres(original, specializzazione) {
    this.servic.delete_servic(original, specializzazione).subscribe((data) => {
      if (data['status'] == 200) {
        let index = this.spec_ser_edit.findIndex(
          (elem) => elem.specializzazione === specializzazione
        );
        let index2 = this.spec_ser_edit[index].all_services.findIndex(
          (elem) =>
            elem.service_name === original.service_name &&
            elem.cost == original.cost &&
            elem.description == original.description &&
            elem.time == original.time
        );

        this.spec_ser_edit[index].all_services.splice(index2, 1);

        this.cdr.detectChanges();
        $('.popup-top').addClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text('You have eddit a service!');
        $('.bottom-message span').text('Thank you for choosing the MedCent');
        $('.bottom-next span').text('close');

        $('.popup-background').addClass('popup-active');
      } else {
        $('.popup-top').removeClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text('Sorry something whent wrong...');
        $('.bottom-message span').text('Request filld must not be empty!');
        $('.bottom-next span').text('Return to the form');
        $('.popup-background').addClass('popup-active');
        return;
      }
    });
  }

  spec_name: string = '';
  add_spec() {
    if (this.spec_name.trim() === '') {
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text('Sorry something whent wrong...');
      $('.bottom-message span').text('Fild must be fild!');
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
      return;
    }

    this.servic.add_spec(this.spec_name).subscribe((data) => {
      if (data['status'] == 200) {
        $('.popup-top').addClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text('You have eddit a service!');
        $('.bottom-message span').text('Thank you for choosing the MedCent');
        $('.bottom-next span').text('close');

        $('.popup-background').addClass('popup-active');
      } else {
        $('.popup-top').removeClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text('Sorry something whent wrong...');
        $('.bottom-message span').text('Fild must be fild!');
        $('.bottom-next span').text('Return to the form');
        $('.popup-background').addClass('popup-active');
        return;
      }
    });
  }

  selected_spec: string = '';
  li_cange(idli) {
    let text = $(`#${idli}`).text();
    let id = $(`#${idli}`).parent().attr('name');
    let selector = '#' + id;
    let span = $(selector);
    this.selected_spec = text;
    span.text(text);
    span.parent().css({ color: '#444444' });
  }

  li_cange2(idli) {
    let text = $(`#${idli}`).text();
    let id = $(`#${idli}`).parent().attr('name');
    let selector = '#' + id;
    let span = $(selector);
    this.selected_spec = idli;
    span.text(text);
    span.parent().css({ color: '#444444' });
  }

  save_specsercedit2(spec) {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (
      this.selected_spec === '' ||
      this.dummy.service_name === '' ||
      this.dummy.servic_cost == null ||
      this.dummy.service_des === undefined
    ) {
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text("Sorry you can't submit...");
      $('.bottom-message span').text('Request filld must not be empty!');
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
      return;
    } else {
      if (this.dummy.service_des.trim() === '') {
        $('.popup-top').removeClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text("Sorry you can't submit...");
        $('.bottom-message span').text('Request filld must not be empty!');
        $('.bottom-next span').text('Return to the form');
        $('.popup-background').addClass('popup-active');
        return;
      }
      if (
        this.dummy.service_dur === undefined ||
        this.dummy.service_dur.trim() === ''
      ) {
        this.dummy.service_dur = '30:00';
      } else if (!timeRegex.test(this.dummy.service_dur)) {
        $('.popup-top').removeClass('success');
        $('.top-image img').attr(
          'src',
          '../../assets/icons/MedCent Exclamation.svg'
        );
        $('.top-message span').text("Sorry you can't submit...");
        $('.bottom-message span').text('Request filld must not be empty!');
        $('.bottom-next span').text('Return to the form');
        $('.popup-background').addClass('popup-active');
        return;
      }

      this.servic.add_ser_spec(spec, this.dummy).subscribe((data) => {
        if (data['status'] == 200) {
          console.log(data);
          this.dummy = new NewServicRequest();
          this.cdr.detectChanges();
          this.cdr.detectChanges();
          $('.popup-top').addClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text('You have eddit a service!');
          $('.bottom-message span').text('Thank you for choosing the MedCent');
          $('.bottom-next span').text('close');

          $('.popup-background').addClass('popup-active');
        } else {
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Request filld must not be empty!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return;
        }
      });
    }
  }

  discount: number = 0;
  add_dis() {
    if (this.selected_spec.trim() === '' || this.discount == 0) {
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text('Sorry something whent wrong...');
      $('.bottom-message span').text('Fild must be fild!');
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
      return;
    }

    this.servic
      .add_discount(this.selected_spec, this.discount)
      .subscribe((data) => {
        if (data['status'] === 200) {
          $('.popup-top').addClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text('You have eddit a service!');
          $('.bottom-message span').text('Thank you for choosing the MedCent');
          $('.bottom-next span').text('close');

          $('.popup-background').addClass('popup-active');
          this.discount = 0;
          this.selected_spec = '';
        } else {
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text('Sorry something whent wrong...');
          $('.bottom-message span').text('Server error!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return;
        }
      });
  }

  register_doc() {
    this.router.navigate(['/register_doctor']);
  }

  logout() {
    sessionStorage.removeItem('user_token');
    localStorage.removeItem('type')
    this.router.navigate(['/']);
  }
}
