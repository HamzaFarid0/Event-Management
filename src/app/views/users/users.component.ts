import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any[] = []; // Array to store users

  constructor(private _usersService: UsersService) {}

  ngOnInit(): void {
    this._usersService.getUsersWithRoleUser().subscribe((data) => {
      this.users = data; // Assign the fetched users
      console.log('Users with role "user":', this.users);
    });
  }
}
