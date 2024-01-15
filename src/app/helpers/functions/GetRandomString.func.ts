function GetRandomString (limit = 5): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = lower.toUpperCase();
  const numbers = '0123456789';
  const total = lower + upper + numbers;

  var code = '';
  const l = total.length;
  for (var i = 0; i < limit; i++) {
    const index = Math.round(Math.random() * (l - 1));
    const char = total[index];
    code += char;
  }

  return code;
}

export default GetRandomString;
