export class Source {
    constructor(public numberType: number = 1,
        public stringType: string = "",
        // public bigIntType: bigint = BigInt(1),
        public anyType: any = () => "2",
        public booleanType: boolean = true){ }
}

export class Destination {
    constructor(public destinationNumberType: number = 1,
        public destinationStringType: string = "",
        // public destinationBigIntType: bigint = BigInt(1),
        public destinationAnyType: any = () => "2",
        public destinationBooleanType: boolean = true){ }
}