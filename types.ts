
type stars = [number,number,number,string][];

type star = {
    hip:number,
    desig:string,
    ra: number,
    de: number
}

type coordinates = [
    {
        hip:string
    }[][],

    stars,

    {
        highX:number,
        highY:number
    }
];

type Data = Array<Array<star>|{highX:number,highY:number}>

export type {star, stars, coordinates}