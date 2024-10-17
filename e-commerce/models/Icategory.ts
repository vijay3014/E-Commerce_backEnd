export interface ISubCategory {
    _id?: string;
    name: string;
    desc: string;
}

export interface ICategory {
    _id?: string;
    name: string;
    desc: string;
    subCategories: ISubCategory[],
    createdAt?: Date;
    updatedAt?: Date;
}