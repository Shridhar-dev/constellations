
type stars = [number,number,number][];

type star = {
    hip:number,
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