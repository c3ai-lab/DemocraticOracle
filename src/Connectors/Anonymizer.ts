import chalk from 'chalk';
import { Color } from '../Enum/Color';

export default {
    anonymize(string: string): string {
        if (string) {
            let visibleChars = 20;
            if (string.length < visibleChars) {
                console.log(chalk[Color.warn]("Connot anonymize :("));
            } else {
                let out = string.substr(0, visibleChars);
                for (let cnt = visibleChars; cnt < string.length; cnt++) {
                    out = out + '*';
                }
                string = out;
            }
        }
        return string;
    }

};