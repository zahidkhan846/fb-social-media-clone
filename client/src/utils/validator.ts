export class Validator {
  isEmpty(value: string) {
    if (value.trim() === "") {
      return true;
    } else {
      return false;
    }
  }
}
