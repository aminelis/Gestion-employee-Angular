export class Employee {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  salary!: number;
  age!: number;
  dob!: string;
  address!: string;
  imageUrl!: string;
  contactNumber!: string;

  constructor() {
      this.email = "@gmail.com";
      this.salary = 0;
  }
}
