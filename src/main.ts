import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import './style.css'
import 'element-plus/dist/index.css'
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import App from './App.vue'

export class ScoreSet {
    private scores: Map<string, Map<number, number>>;

    constructor() {
        this.scores = new Map();
    }

    clear() {
        this.scores.clear();
    };

    set(player: string, round: number, score: number) {
        if (!this.scores.has(player)) {
            this.scores.set(player, new Map());
        }
        this.scores.get(player)?.set(round, score);
    }

    full_score() {
        const result: [string, number][] = [];
        for (const player of this.scores.keys()) {
            const player_scores = this.scores.get(player) as Map<number, number>;
            var sum = 0;
            for (const score of player_scores?.values()) {
                sum += score;
            }
            result.push([player, sum]);
        };
        return result.sort((x, y) => y[1] - x[1]);
    }

    average_score() {
        const result: [string, number][] = [];
        for (const player of this.scores.keys()) {
            const player_scores = this.scores.get(player) as Map<number, number>;
            var count = 0;
            var sum = 0;
            for (const score of player_scores?.values()) {
                sum += score;
                count++;
            }
            result.push([player, sum / count]);
        };
        return result.sort((x, y) => y[1] - x[1]);
    }

    max_score() {
        const result: [string, number][] = [];
        for (const player of this.scores.keys()) {
            const player_scores = this.scores.get(player) as Map<number, number>;
            var max = 0;
            for (const score of player_scores?.values()) {
                max = Math.max(score, max);
            }
            result.push([player, max]);
        };
        return result.sort((x, y) => y[1] - x[1]);
    }
    
    is_empty() {
        return this.scores.size === 0;
    }
}

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');