import { ByteSizePipe } from './byte-size.pipe';

describe('ByteSizePipe', () => {
  it('create an instance', () => {
    const pipe = new ByteSizePipe();
    expect(pipe).toBeTruthy();
  });
});
