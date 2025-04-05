import {Tag} from "/js/Tag.js";
import * as Tags from "/js/Tags.js";

export class Widget extends Tag
{
  static GetLocalName(){ return "widget"; }
  static GetMetaURL(){ return import.meta.url; }

  New(ctor, ...args){ return new ctor().Add(...args); }

  Div(...a){ return this.New(Tags.Div, ...a); }
  A(...a){ return this.New(Tags.A, ...a); }
  Span(...a){ return this.New(Tags.Span, ...a); }
  P(...a){ return this.New(Tags.P, ...a); }
  Strong(...a){ return this.New(Tags.Strong, ...a); }
  Text(...a){ return this.New(Tags.Text, ...a); }
  Img(...a){ return this.New(Tags.Img, ...a); }
  Section(...a){ return this.New(Tags.Section, ...a); }
  H1(...a){ return this.New(Tags.H1, ...a); }
  H2(...a){ return this.New(Tags.H2, ...a); }
  H3(...a){ return this.New(Tags.H3, ...a); }
  H4(...a){ return this.New(Tags.H4, ...a); }
  H5(...a){ return this.New(Tags.H5, ...a); }
  H6(...a){ return this.New(Tags.H6, ...a); }
  Sub(...a){ return this.New(Tags.Sub, ...a); }
  Sup(...a){ return this.New(Tags.Sup, ...a); }
  Pre(...a){ return this.New(Tags.Pre, ...a); }
  Code(...a){ return this.New(Tags.Code, ...a); }
  IFrame(...a){ return this.New(Tags.IFrame, ...a); }
  OL(...a){ return this.New(Tags.OL, ...a); }
  UL(...a){ return this.New(Tags.UL, ...a); }
  LI(...a){ return this.New(Tags.LI, ...a); }
  B(...a){ return this.New(Tags.B, ...a); }
  HR(...a){ return this.New(Tags.HR, ...a); }
  TH(...a){ return this.New(Tags.TH, ...a); }
  TR(...a){ return this.New(Tags.TR, ...a); }
  TD(...a){ return this.New(Tags.TD, ...a); }
  Q(...a){ return this.New(Tags.Q, ...a); }
  S(...a){ return this.New(Tags.S, ...a); }
  I(...a){ return this.New(Tags.I, ...a); }
  Template(...a){ return this.New(Tags.Template, ...a); }
  Link(...a){ return this.New(Tags.Link, ...a); }
  Meta(...a){ return this.New(Tags.Meta, ...a); }
  Script(...a){ return this.New(Tags.Script, ...a); }
  NoScript(...a){ return this.New(Tags.NoScript, ...a); }
  Title(...a){ return this.New(Tags.Title, ...a); }
  Button(...a){ return this.New(Tags.Button, ...a); }
  Abbr(...a){ return this.New(Tags.Abbr, ...a); }
  Address(...a){ return this.New(Tags.Address, ...a); }
  Article(...a){ return this.New(Tags.Article, ...a); }
  Audio(...a){ return this.New(Tags.Audio, ...a); }
  Video(...a){ return this.New(Tags.Video, ...a); }
  Aside(...a){ return this.New(Tags.Aside, ...a); }
  Base(...a){ return this.New(Tags.Base, ...a); }
  Cite(...a){ return this.New(Tags.Cite, ...a); }
  Header(...a){ return this.New(Tags.Header, ...a); }
  Footer(...a){ return this.New(Tags.Footer, ...a); }
  Menu(...a){ return this.New(Tags.Menu, ...a); }
  MenuItem(...a){ return this.New(Tags.MenuItem, ...a); }
  DD(...a){ return this.New(Tags.DD, ...a); }
  DL(...a){ return this.New(Tags.DL, ...a); }
  DT(...a){ return this.New(Tags.DT, ...a); }
  Style(...a){ return this.New(Tags.Style, ...a); }
  Form(...a){ return this.New(Tags.Form, ...a); }
  Time(...a){ return this.New(Tags.Time, ...a); }
  Table(...a){ return this.New(Tags.Table, ...a); }
  THead(...a){ return this.New(Tags.THead, ...a); }
  TBody(...a){ return this.New(Tags.TBody, ...a); }
  TFoot(...a){ return this.New(Tags.TFoot, ...a); }
  Samp(...a){ return this.New(Tags.Samp, ...a); }
  Small(...a){ return this.New(Tags.Small, ...a); }
  Summary(...a){ return this.New(Tags.Summary, ...a); }
  Ins(...a){ return this.New(Tags.Ins, ...a); }
  Del(...a){ return this.New(Tags.Del, ...a); }
  Source(...a){ return this.New(Tags.Source, ...a); }
  Slot(...a){ return this.New(Tags.Slot, ...a); }
  Figure(...a){ return this.New(Tags.Figure, ...a); }
  Nav(...a){ return this.New(Tags.Nav, ...a); }
}