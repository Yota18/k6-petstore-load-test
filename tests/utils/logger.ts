export class Logger {
    static log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        console.log(`${icons[type]}  ${message}`);
    }

    static scenario(name: string) {
        console.log(`\n🎬 Starting Scenario: ${name}`);
    }

    static step(name: string) {
        console.log(`   🔸 Step: ${name}`);
    }
}
