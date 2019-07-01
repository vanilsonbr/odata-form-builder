import { ODataFormBuilder, ODataQuery } from "../src/odata-form-builder";
import { Source, Destination } from './models';

function defaultQuery() : ODataQuery {
    return { $filter: null, $count: true, $orderBy: null, $skip: null, $top: 20 };
}

function defaultOptions() {
    return { $count: true, $orderBy: null, $top: 20, $skip: null };
}

/**
 * Dummy test
 */
describe("Odata builder tests", () => {
    it("should build a default query with no filters", () => {
        //Arrange
        const expectedResult = defaultQuery();
        let destination = new Destination();

        //Test
        let query = new ODataFormBuilder<Source, Destination>().toQuery(destination);

        //Assert
        expect(query.$count).toEqual(expectedResult.$count);
        expect(query.$top).toEqual(expectedResult.$top);
        expect(query.$filter).toEqual(expectedResult.$filter);
        expect(query.$orderBy).toEqual(expectedResult.$orderBy);
        expect(query.$skip).toEqual(expectedResult.$skip);
    });

    it("should build a query by using the override query options", () => {
        //Arrange
        const expectedResult : ODataQuery = {
            $filter: null,
            $count: false,
            $orderBy: "stringType",
            $skip: 5,
            $top: 10
        }
        let destination = new Destination();

        //Test
        let query = new ODataFormBuilder<Source, Destination>().toQuery(destination, { $skip: 5, $top: 10, $orderBy: "stringType", $count: false });

        //Assert
        expect(query.$count).toEqual(expectedResult.$count);
        expect(query.$top).toEqual(expectedResult.$top);
        expect(query.$filter).toEqual(expectedResult.$filter);
        expect(query.$orderBy).toEqual(expectedResult.$orderBy);
        expect(query.$skip).toEqual(expectedResult.$skip);
    });
    
    it("should build a default querystring with no filters", () => {
        //Arrange
        const expectedResult = "$orderBy=stringType$skip=5$top=10";
        let destination = new Destination();
        
        //Test
        let queryString = new ODataFormBuilder<Source, Destination>().toQueryString(destination, { $count: false, $orderBy: "stringType", $skip: 5, $top: 10 });
        
        //Assert
        expect(queryString).toEqual(expectedResult);
    });

    it("should build a querystring by using the override query options", () => {
        //Arrange
        const expectedResult = "$count=true$top=20";
        let destination = new Destination();
        
        //Test
        let queryString = new ODataFormBuilder<Source, Destination>().toQueryString(destination);
        
        //Assert
        expect(queryString).toEqual(expectedResult);
    });
    
    it("should build a query with a property returning string filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=stringType eq 'foo'$top=20";
        const expectedQueryResult : ODataQuery = {
            $count: true,
            $filter: "stringType eq 'foo'",
            $top: 20,
            $skip: null,
            $orderBy: null
        };
        let destination = new Destination();
        destination.destinationStringType = "foo";

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().equals(x => x.stringType, x => x.destinationStringType);
        let query = formBuilder.toQuery(destination, { $count: true, $top: 20, $skip: null, $orderBy: null });
        let queryString = formBuilder.toQueryString(destination, { $count: true, $top: 20, $skip: null, $orderBy: null });

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a property returning number filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=contains(numberType, 123)$top=20";
        const expectedQueryResult : ODataQuery = {
            $filter: "contains(numberType, 123)",
            $count: true,
            $orderBy: null,
            $top: 20,
            $skip: null
        };
        let destination = new Destination();
        destination.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().contains(x => x.numberType, x => x.destinationNumberType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a property returning boolean filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=booleanType eq true$top=20";
        const expectedQueryResult : ODataQuery = {
            $filter: "booleanType eq true",
            $count: true,
            $orderBy: null,
            $top: 20,
            $skip: null
        };
        let destination = new Destination();
        destination.destinationBooleanType = true;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().equals(x => x.booleanType, x => x.destinationBooleanType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a lowerThan filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType lt 123$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType lt 123";
        let destination = new Destination();
        destination.destinationNumberType = 123;
        //Second arrangement
        const expectedResult2 = "$count=true$filter=numberType lt 124$top=20";
        const expectedQueryResult2 = defaultQuery();
        expectedQueryResult2.$filter = "numberType lt 124";
        let destination2 = new Destination();
        destination2.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().lowerThan(x => x.numberType, x => x.destinationNumberType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());
        // Second Test (with validation pipeline)
        
        let formBuilder2 = new ODataFormBuilder<Source, Destination>().lowerThan(x => x.numberType, x => x.destinationNumberType, value => value + 1);
        let query2 = formBuilder2.toQuery(destination2, defaultOptions());
        let queryString2 = formBuilder2.toQueryString(destination2, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
        //Assert 2
        expect(queryString2).toEqual(expectedResult2);
        expect(query2.$filter).toEqual(expectedQueryResult2.$filter);
    });

    it("should build a query with a lowerThanOrEqual filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType le 123$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType le 123";
        let destination = new Destination();
        destination.destinationNumberType = 123;
        //Second arrangement
        const expectedResult2 = "$count=true$filter=numberType le 124$top=20";
        const expectedQueryResult2 = defaultQuery();
        expectedQueryResult2.$filter = "numberType le 124";
        let destination2 = new Destination();
        destination2.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().lowerThanOrEqual(x => x.numberType, x => x.destinationNumberType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());
        // Second Test (with validation pipeline)
        
        let formBuilder2 = new ODataFormBuilder<Source, Destination>().lowerThanOrEqual(x => x.numberType, x => x.destinationNumberType, value => value + 1);
        let query2 = formBuilder2.toQuery(destination2, defaultOptions());
        let queryString2 = formBuilder2.toQueryString(destination2, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
        //Assert 2
        expect(queryString2).toEqual(expectedResult2);
        expect(query2.$filter).toEqual(expectedQueryResult2.$filter);
    });    

    it("should build a query with a greaterThan filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType gt 123$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType gt 123";
        let destination = new Destination();
        destination.destinationNumberType = 123;
        //Second arrangement
        const expectedResult2 = "$count=true$filter=numberType gt 124$top=20";
        const expectedQueryResult2 = defaultQuery();
        expectedQueryResult2.$filter = "numberType gt 124";
        let destination2 = new Destination();
        destination2.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().greaterThan(x => x.numberType, x => x.destinationNumberType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());
        // Second Test (with validation pipeline)
        
        let formBuilder2 = new ODataFormBuilder<Source, Destination>().greaterThan(x => x.numberType, x => x.destinationNumberType, value => value + 1);
        let query2 = formBuilder2.toQuery(destination2, defaultOptions());
        let queryString2 = formBuilder2.toQueryString(destination2, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
        //Assert 2
        expect(queryString2).toEqual(expectedResult2);
        expect(query2.$filter).toEqual(expectedQueryResult2.$filter);
    });

    it("should build a query with a greaterThanOrEqual filter correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType ge 123$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType ge 123";
        let destination = new Destination();
        destination.destinationNumberType = 123;
        //Second arrangement
        const expectedResult2 = "$count=true$filter=numberType ge 124$top=20";
        const expectedQueryResult2 = defaultQuery();
        expectedQueryResult2.$filter = "numberType ge 124";
        let destination2 = new Destination();
        destination2.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>().greaterThanOrEqual(x => x.numberType, x => x.destinationNumberType);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());
        // Second Test (with validation pipeline)
        
        let formBuilder2 = new ODataFormBuilder<Source, Destination>().greaterThanOrEqual(x => x.numberType, x => x.destinationNumberType, value => value + 1);
        let query2 = formBuilder2.toQuery(destination2, defaultOptions());
        let queryString2 = formBuilder2.toQueryString(destination2, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
        //Assert 2
        expect(queryString2).toEqual(expectedResult2);
        expect(query2.$filter).toEqual(expectedQueryResult2.$filter);
    });

    it("should build a query with a pipeline and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType ge 124$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType ge 124";
        let destination = new Destination();
        destination.destinationNumberType = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();
        formBuilder.greaterThanOrEqual(x => x.numberType, x => x.destinationNumberType, (destinationNumberType) => destinationNumberType + 1 );
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a filter contains and compare with a literal number value and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType eq 124$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType eq 124";
        let destination = new Destination();
        const literal : number = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();
        formBuilder.equals(x => x.numberType, literal, destinationNumberType => destinationNumberType + 1 );
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a filter contains and compare with a literal string value and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=contains(stringType, 'foo1')$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "contains(stringType, 'foo1')";
        let destination = new Destination();
        const literal : string = "foo";

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();  
        formBuilder.contains(x => x.stringType, literal, destinationStringType => destinationStringType + 1 );
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a filter contains and compare with a literal string value and do not put quotation marks and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=contains(stringType, foo1)$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "contains(stringType, foo1)";
        let destination = new Destination();
        const literal : string = "foo";

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();  
        formBuilder.contains(x => x.stringType, literal, destinationStringType => destinationStringType + 1, false);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a filter equals and compare with a literal number value and do not put quotation marks and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType eq 124$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType eq 124";
        let destination = new Destination();
        const literal : number = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();  
        formBuilder.equals(x => x.numberType, literal, numberType => numberType + 1, false);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    it("should build a query with a filter equals and compare with a literal number value and do not put quotation marks even when explicitly set and return correctly", () => {
        //Arrange
        const expectedResult = "$count=true$filter=numberType eq 124$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = "numberType eq 124";
        let destination = new Destination();
        const literal : number = 123;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();  
        formBuilder.equals(x => x.numberType, literal, numberType => numberType + 1, true);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    // it("should build a query with a filter contains and compare with a literal bigint value and return correctly", () => {
    //     //Arrange
    //     const expectedResult = "$count=true$filter=bigIntType eq 4294967295$top=20";
    //     const expectedQueryResult = defaultQuery();
    //     expectedQueryResult.$filter = "bigIntType eq 4294967295";
    //     let destination = new Destination();
    //     const literal : bigint = BigInt(4294967295);

    //     //Test
    //     let formBuilder = new ODataFormBuilder<Source, Destination>();  
    //     formBuilder.equals(x => x.bigIntType, literal);
    //     let query = formBuilder.toQuery(destination, defaultOptions());
    //     let queryString = formBuilder.toQueryString(destination, defaultOptions());

    //     //Assert
    //     expect(queryString).toEqual(expectedResult);
    //     expect(query.$filter).toEqual(expectedQueryResult.$filter);
    // });

    it("should not build the filter when a pipeline returns a null value", () => {
        //Arrange
        const expectedResult = "$count=true$top=20";
        const expectedQueryResult = defaultQuery();
        expectedQueryResult.$filter = null;
        let destination = new Destination();
        destination.destinationNumberType = 2;

        //Test
        let formBuilder = new ODataFormBuilder<Source, Destination>();
        formBuilder.equals(x => x.numberType, destination.destinationNumberType, (_) => null);
        let query = formBuilder.toQuery(destination, defaultOptions());
        let queryString = formBuilder.toQueryString(destination, defaultOptions());

        //Assert
        expect(queryString).toEqual(expectedResult);
        expect(query.$filter).toEqual(expectedQueryResult.$filter);
    });

    // it("should not build a query with a property returning a function filter and throw an error", () => {
    //     //Arrange
    //     let destination = new Destination();
    //         //the user could hack the filter function passing a property with type 'any'. It is checked in the internals 
    //     destination.destinationAnyType = () => "2"; 

    //     //Test
    //     let formBuilder = new ODataFormBuilder<Source, Destination>()
    //         .contains(x => x.anyType, x => x.destinationAnyType);

    //     //Assert
    //     expect(() => {
    //         formBuilder.toQuery(destination);
    //     }).toThrowError("odata-form-builder: unrecognized filter value type: function");
    // });
})