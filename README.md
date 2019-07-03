# OData Form Builder

<!---[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)-->
<!---[![Greenkeeper badge](https://badges.greenkeeper.io/alexjoverm/typescript-library-starter.svg)](https://greenkeeper.io/)-->
[![Travis](https://travis-ci.org/vanilsonbr/odata-form-builder.svg?branch=master)](https://travis-ci.org/vanilsonbr/odata-form-builder.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/vanilsonbr/odata-form-builder/badge.svg?branch=master)](https://coveralls.io/github/vanilsonbr/odata-form-builder?branch=master)
[![Dev Dependencies](https://david-dm.org/vanilsonbr/odata-form-builder/dev-status.svg)](https://david-dm.org/vanilsonbr/odata-form-builder?type=dev)
<!---[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)]()-->

A library to help you build your odata forms faster and in a more dynamic style.
All the form validation filters are made once. After that, all you need to do is transform it into a odata query. 

## Library under development!
We need your help to improve this library, implement all the features and fix the bugs that are.
Your feedback is important to us!

### What is under development?
 - The rest of the odata query functions ( like string, date, math, type functions and built-in filters )
 - THe ability to use $select to choose only the required properties of the resulting object
 - The ability to $expand
 - The ability to add or remove filters to make your form filters dynamic
 - Much much more functionalities: odata is huge, so there is much to build!

## Usage

Import the library
```typescript
import { ODataFormBuilder, ODataQuery } from 'odata-form-builder';
```

Here, `Source` will be a class that represents the source of your information.

e.g. If your request returns an objects containing an `{ id:number; name:string; }`, your Source object should have those same properties
```typescript
import Source from '...';
```
MyForm class will represent your form here
```typescript 
import MyForm from '...';
```
You will create a Builder to be able to apply the filters.

You can add filters by building upon the variable
```typescript
let odataFormBuilder = new ODataFormBuilder<Source, MyForm>();
odataFormBuilder.filters(f => f.contains(source => source.id, form => form.id));
```
or
```typescript
let odataFormBuilder = new ODataFormBuilder<Source, MyForm>()
    .filters(f => f
        .contains(source => source.id, form => form.id)
        .equals(source => source.name, form => form.name));
```
When you are ready to make the request to your server, you can simply call `toQuery()` or `toQueryString()`, passing the current state of the object
```typescript
let formCurrentState : MyForm = new MyForm(1, "foo");
let queryString: string = odataFormBuilder.toQueryString(formCurrentState); 
// $count=true;$filter=contains(id, 1) and name eq 'foo'$top=20
let query: ODataQuery = odataFormBuilder.toQuery(formCurrentState); 
// { $count: true, $filter: "contains(id, 1) and name eq 'foo'", $top: 20 }
```

You can define transformations to the form value by setting a pipeline:
```typescript
//...
odataFormBuilder.filters(f => f
    .greaterThan(s => s.count, d => d.count,
        (destinationCountValue, form) => form.hasSomething? destinationCountValue : destinationCountValue + 1));

odataFormBuilder.toQuery(formCurrentState);
```

if the pipeline returns `null`, the filter won't be added to the final query
```typescript
currentStateForm.address = "San Pedro Street, 256";
correntStateForm.userSelectedAddress = false;

odataFormBuilder.filers(f => f
    .equals(s => s.address, d => d.address,
        (address, form) => form.userSelectedAddress? address : null));

odataFormBuilder.toQuery(formCurrentState); // won't add the term "address eq 'San Pedro Street, 256'" to the filter
```

For string typed values, you can control if the odata filter will have quotation marks or not

It can be used, for instance, when a Date comparison has to be made.
```typescript
currentStateForm.date = "2019-06-28";
let dateToStringPipeline = (date: string) => `${date}T00:00:00.000Z`; 

odataFormBuilder.filters(f => f
    .greaterThanOrEqual(s => s.initialDate, d => d.initialDate, dateToStringPipeline, false /*do not put quotation marks*/));
odataFormBuilder.toQueryString(formCurrentState); // $count=true$filter=date ge 2019-06-28T00:00:00.000Z$top=20
```

## More to come
The libray is still under development!

Test the library, open issued and let's go enhance it!