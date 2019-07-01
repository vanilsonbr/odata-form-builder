# TypeScript library starter

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/alexjoverm/typescript-library-starter.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)
[![Dev Dependencies](https://david-dm.org/alexjoverm/typescript-library-starter/dev-status.svg)](https://david-dm.org/alexjoverm/typescript-library-starter?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/AJoverMorales)

A library to help you build your odata forms faster and in a more dynamic style.
All the form validation filters are made once. After that, all you need to do is transform it into a odata query. 

### Library under development!
We need your help to improve this library, implement all the features and fix the bugs that are.
Your feedback is important to us!

## What is under development?
 - The rest of the odata query functions ( like string, date, math, type functions and built-in filters )
 - THe ability to use $select to choose only the required properties of the resulting object
 - The ability to $expand
 - The ability to add or remove filters to make your form filters dynamic
 - Much much more functionalities: odata is huge, so there is much to build!

### Usage

```typescript
import { ODataFormBuilder, ODataQuery } from 'odata-form-builder';

// assumming that you import a class that will represent the source of your information
// e.g. if your request returns an objects containing an id:number and name:string, your Source object should have those same properties
import Source from '...';
// and a class that will represent your form
import MyForm from '...';

//You will create a Builder to be able to apply the filters
let odataFormBuilder = new ODataFormBuilder<Source, MyForm>();

// you can add filters by building upon the variable
odataFormBuilder = odataFormBuilder.contains(source => source.id, form => form.id);
//or
odataFormBuilder = new ODataFormBuilder<Source, MyForm>()
    .contains(source => source.id, form => form.id)
    .equals(source => source.name, form => form.name)

//when you are ready to make the request to your server, you can simply call toQuery() or toQueryString(), passing the current state of the object
let formCurrentState : MyForm = new MyForm(1, "foo");
let queryString: string = odataFormBuilder.toQueryString(formCurrentState); // $count=true;$filter=contains(id, 1) and name eq 'foo'$top=20
let query: ODataQuery = odataFormBuilder.toQuery(formCurrentState); // { $count: true, $filter: "contains(id, 1) and name eq 'foo'", $top: 20 }
```

You can define transformations to the form value by setting a pipeline:
```typescript
//...
odataFormBuilder.greaterThan(s => s.count, d => d.count,
    (destinationCountValue, form) => form.hasSomething? destinationCountValue : destinationCountValue + 1);

odataFormBuilder.toQuery(formCurrentState);
```

if the pipeline returns `null`, the filter won't be added to the final query
```typescript
currentStateForm.address = "San Pedro Street, 256";
correntStateForm.userSelectedAddress = false;

odataFormBuilder.equals(s => s.address, d => d.address,
    (address, form) => form.userSelectedAddress? address : null);

odataFormBuilder.toQuery(formCurrentState); // won't add the term "address eq 'San Pedro Street, 256'" to the filter
```

For string typed values, you can control if the odata filter will have quotation marks or not
It can be used, for instance, when a Date comparison has to be made.
```typescript
currentStateForm.date = "2019-06-28";
let dateToStringPipeline = (date: string) => `${date}T00:00:00.000Z`; 

odataFormBuilder.greaterThanOrEqual(s => s.initialDate, d => d.initialDate, dateToStringPipeline, false); // do not put quotation marks
odataFormBuilder.toQueryString(formCurrentState); // $count=true$filter=date ge 2019-06-28T00:00:00.000Z$top=20
```