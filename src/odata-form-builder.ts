// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export type ODataQuery = {
    /** contains the filters stringified */
    $filter: string | null;
    /** determines if request result will contain a number property 'count' indicating the total number of registers for the non-filtered query */
    $count: boolean;
    /** allows the client to request the resources by a specific property of the object in ascending order */
    $orderBy: string | null;
    /** allows the client to skip a number of requested resources. If this value is set to null, no resource will be skipped */
    $skip: number | null;
    /** allows the client request a max number of requested resources */
    $top: number;
}

type ODataQueryNoFilter = {
    /** determines if request result will contain a number property 'count' indicating the total number of registers for the non-filtered query */
    $count: boolean;
    /** allows the client to request the resources by a specific property of the object in ascending order */
    $orderBy: string | null;
    /** allows the client to skip a number of requested resources. If this value is set to null, no resource will be skipped */
    $skip: number | null;
    /** allows the client request a max number of requested resources */
    $top: number;
}

function getPropName<T>(propertyExpression: Expr<T>): string {
    let matches = /function\s*\((\w+)\)\s*\{\s*return \1[.](\w+);*\s*\}/g.exec(propertyExpression.toString());
    // it will always return the property name, since the transpilation to javascript:
    //  example: propertyExpression = "x => x.name"; transpilation: "function(x) { return x.name }" 
    return matches![2];
}

function keys<O extends object>(obj: O): Array<keyof O> {
    return Object.keys(obj) as Array<keyof O>;
}

enum FragmentType {
    Filter
};

type Fragment<TDestination> = {
    expression: Expression<TDestination>;
    type: FragmentType;
};

type Expr<TDestination> = (obj: TDestination) => string | number | boolean | null;
type ValuePipeline<TDestination> = (value: any, object: TDestination) => string | number | boolean | null;

class Expression<TDestination> {
    constructor(
        public sourceProperty: string,
        public destinationProperty: Expr<TDestination> | string | number | boolean,
        public expressionBody: string,
        public valuePipeline: ValuePipeline<TDestination> | null,
        public putQuotationMarksOnValue: boolean) {
    }
}

export class ODataFormBuilder<TSource, TDestination> {
    fragments: Fragment<TDestination>[] = [];

    /**
     * Applies odata's contains to the filter ( contains(<property>, <value>) )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    contains(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | string, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "contains($1, $2)", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Applies odata's equals to the filter ( <property> eq <value> )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    equals(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | string | number | boolean, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "$1 eq $2", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Applies odata's greatherThan to the filter ( <property> gt <value> )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    greaterThan(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | number | string, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "$1 gt $2", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Applies odata's greaterThanOrEqual to the filter ( <property> ge <value> )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    greaterThanOrEqual(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | number | string, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "$1 ge $2", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Applies odata's lowerThan to the filter ( <property> lt <value> )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    lowerThan(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | number | string, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "$1 lt $2", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Applies odata's lowerThanOrEqual to the filter ( <property> le <value> )
     * @param sourceProperty the property of the source object that will be accessed. (e.g. "x => x.name")
     * @param destinationPropertyOrLiteral the property of the form object that will be accessed (e.g. x => x.id) or a literal string, number or boolean (arrays and objects are not supported for now)
     * @param valuePipeline a transformation pipeline that will be applied to the destionation property (e.g. "id => id + 1")
     * @param putQuotationMarksOnValue "override the internal code to add quotation marks on the value. It can be used, for example, when the value is a Date stringified, in which the internal code will understand as an string and add quotation, but odata will understand as a Date only if it has not the quotation marks"
     */
    lowerThanOrEqual(sourceProperty: Expr<TSource>, destinationPropertyOrLiteral: Expr<TDestination> | number | string, valuePipeline: ValuePipeline<TDestination> | null = null, putQuotationMarksOnValue = true) {
        this.fragments.push({
            expression: new Expression(getPropName(sourceProperty), destinationPropertyOrLiteral, "$1 le $2", valuePipeline, putQuotationMarksOnValue),
            type: FragmentType.Filter
        });
        return this;
    }

    /**
     * Transforms the object into a odata query object
     * @param myObject the current state of the object that will be transformed into a odata query
     * @param queryOptions the odata query options
     */
    toQuery(myObject: TDestination, queryOptions: ODataQueryNoFilter = { $count: true, $skip: null, $orderBy: null, $top: 20 }): ODataQuery {
        let filters: string[] = [];
        this.fragments.forEach(fragment => {
            if(fragment.type !== FragmentType.Filter) {
                return;
            }

            // if it is a function (Expression), It will apply the Expression to the object and get the value.
            //    It's like doing myObject.destinationProperty
            // if it is an literal, I will just assign the value
            let filterValue = typeof fragment.expression.destinationProperty !== "function" ?
                fragment.expression.destinationProperty :
                fragment.expression.destinationProperty(myObject);

            // if the user defined a transformation pipeline to the value, it will get executed here
            //    it's like doing, for instance: myObject.destinationProperty = myObject.destinationProperty.trim()
            // if after this point, filterValue returns null and ignoreFilterWhenValueNull is true,
            //    it is inferred that the user don't want to include this filter to the odata query  
            if (fragment.expression.valuePipeline) {
                filterValue = fragment.expression.valuePipeline(filterValue, myObject);
            }

            // // check here if the value is some of the following: "string", "number", "boolean", "null"
            // // if not: throw error
            // let typeOfFilterValue = typeof filterValue;
            // if(!( filterValue === null || typeOfFilterValue === "string" || typeOfFilterValue === "number" || typeOfFilterValue === "boolean" ))
            //     throw new Error("odata-form-builder: unrecognized filter value type: " + typeOfFilterValue);

            // if the filterValue is null, it will not be added to the filter
            if(filterValue === null) {
                return;
            }

            // put quotation marks if the filter is a string and the let it setted to true
            //   In some cases, like when the value is a date stringified, the quotation marks may not be insertted,
            //      as odata will throw an error ( date gt yyyy-mm-dd:T00:00:00.000Z //no quot. marks here)
            if(typeof filterValue === "string" && fragment.expression.putQuotationMarksOnValue) {
                filterValue = `'${filterValue}'`;
            }

            // relace the placeholders with the actual values (e.g "$1 <operation> $2" => "name eq 'foo'")
            let filter = fragment.expression.expressionBody.replace("$1", fragment.expression.sourceProperty).replace("$2", filterValue.toString());
            filters.push(filter);
        });

        let query: ODataQuery = {
            $count: queryOptions.$count,
            $filter: filters.join(' and ') || null,
            $orderBy: queryOptions.$orderBy,
            $skip: queryOptions.$skip,
            $top: queryOptions.$top
        };

        return query;
    }

    /**
     * Transforms the object into a odata query string
     * @param myObject the current state of the object that will be transformed into a odata query
     * @param queryOptions the odata query options
     */
    toQueryString(myObject: TDestination, queryOptions: ODataQueryNoFilter = { $count: true, $skip: null, $orderBy: null, $top: 20 }): string {
        let query = this.toQuery(myObject, queryOptions);

        return keys(query)
            .filter(key => query[key])
            .map(key => `${key}=${query[key]}`)
            .join('');
    }
}
