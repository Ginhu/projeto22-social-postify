export class Post {
  private _title: string;
  private _text: string;

  constructor(title: string, text: string) {
    this._title = title;
    this._text = text;
  }

  get title() {
    return this._title;
  }

  get text() {
    return this._text;
  }
}
