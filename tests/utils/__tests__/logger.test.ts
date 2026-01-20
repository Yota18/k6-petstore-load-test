import { Logger } from '../logger';

describe('Logger', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('log', () => {
        it('should log info message with default type', () => {
            Logger.log('Test message');
            expect(consoleLogSpy).toHaveBeenCalledWith('ℹ️  Test message');
        });

        it('should log success message', () => {
            Logger.log('Success message', 'success');
            expect(consoleLogSpy).toHaveBeenCalledWith('✅  Success message');
        });

        it('should log error message', () => {
            Logger.log('Error message', 'error');
            expect(consoleLogSpy).toHaveBeenCalledWith('❌  Error message');
        });

        it('should log warning message', () => {
            Logger.log('Warning message', 'warning');
            expect(consoleLogSpy).toHaveBeenCalledWith('⚠️  Warning message');
        });
    });

    describe('scenario', () => {
        it('should log scenario name with proper formatting', () => {
            Logger.scenario('Login Flow');
            expect(consoleLogSpy).toHaveBeenCalledWith('\n🎬 Starting Scenario: Login Flow');
        });
    });

    describe('step', () => {
        it('should log step name with proper formatting', () => {
            Logger.step('Navigate to homepage');
            expect(consoleLogSpy).toHaveBeenCalledWith('   🔸 Step: Navigate to homepage');
        });
    });
});
