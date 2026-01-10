import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export const Mapper = {
    toTS: <T>(data: any): T => {
        return camelcaseKeys(data, { deep: true }) as T;
    },

    toDB: (data: any) => {
        return snakecaseKeys(data, { deep: true });
    }
}
