import { CountryAbbrevType } from './../enums/CountryAbbrevType';

export interface INewsSource {
    id?: string;
    name: string;
    websiteUrl: string;
    slug: string;
    logoUrl?: string;
    twitterUsername?: string;
    youtubeUsername?: string;
    nonProfit: boolean;
    sellsAds: boolean;
    country: CountryAbbrevType;
    created?: Date;
    updated?: Date;
}