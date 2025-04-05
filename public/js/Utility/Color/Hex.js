import {Color} from "/js/Utility/Color.js";

export class Hex
{
  static Primary(){ return new this("#00d1b2"); }
  static Dark(){ return new this("#363636"); }
  static Light(){ return new this("whitesmoke"); }
  static Black(){ return new this("#0a0a0a"); }
  static White(){ return new this("white"); }
  static Info(){ return new this("#209cee"); }
  static Link(){ return new this("#344f79"); }
  static Success(){ return new this("#23d160"); }
  static Warning(){ return new this("#ffdd57"); }
  static Danger(){ return new this("#ff3860"); }

  constructor(value)
  {
    // super(value);
    this.value = value;
  }

  toString(){ return this.value; }
}
