import {window} from "/js/Window.js";
import {MutationObserver} from "/js/Observer/MutationObserver.js";
import {IntersectionObserver} from "/js/Observer/IntersectionObserver.js";
import {EventObserver} from "/js/Observer/EventObserver.js";
import {SizeObserver} from "/js/Observer/SizeObserver.js";
import {FileSystemObserver} from "/js/Observer/FileSystemObserver.js";

export class App
{
  node;
  mutation_observer;
  intersection_observer;
  event_observer;
  size_observer;
  file_system_observer;

  constructor(node)
  {
    this.node = node;
  }

  CreateMutationObserver(){ return new MutationObserver(this.node); }
  CreateIntersectionObserver(){ return new IntersectionObserver(this.node); }
  CreateEventObserver(){ return new EventObserver(this.node); }
  CreateSizeObserver(){ return new SizeObserver(this.node); }
  CreateFileSystemObserver(){ return new FileSystemObserver(this.node); }

  GetMutationObserver(){ return this.mutation_observer ??= this.CreateMutationObserver(); }
  GetIntersectionObserver(){ return this.intersection_observer ??= this.CreateIntersectionObserver(); }
  GetEventObserver(){ return this.event_observer ??= this.CreateEventObserver(); }
  GetSizeObserver(){ return this.size_observer ??= this.CreateSizeObserver(); }
  GetFileSystemObserver(){ return this.file_system_observer ??= this.CreateFileSystemObserver(); }
}
