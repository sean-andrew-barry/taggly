// export class Singleton
// {
//   #type;
//   #instance;
//
//   constructor(type)
//   {
//     this.#type = type;
//
//     return new Proxy(type, {
//       get: (target, prop, receiver) =>
//       {
//         console.log("Calling getter", prop, receiver);
//         this.#instance ??= this.Create();
//
//         return Reflect.get(this.#instance, prop, receiver);
//       },
//     });
//   }
//
//   Type(type)
//   {
//     this.#type = type;
//   }
//
//   Create()
//   {
//     console.log("Singleton creating", this.#type);
//     return new this.#type();
//   }
// }

export function Singleton(type)
{
  let instance;
  return new Proxy(type, {
    get: (target, prop, receiver) =>
    {
      console.log("Calling getter", prop, receiver);
      instance ??= new type();

      return Reflect.get(instance, prop, receiver);
    },
  });
}
