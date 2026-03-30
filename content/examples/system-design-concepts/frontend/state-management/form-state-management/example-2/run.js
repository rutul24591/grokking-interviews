const modes = ['change', 'blur', 'submit'];
const value = 'a@';
for (const mode of modes) {
  const timeline = [];
  if (mode === 'change') timeline.push('error visible while typing');
  if (mode === 'blur') timeline.push('error appears on blur');
  if (mode === 'submit') timeline.push('error delayed until submit');
  console.log({ mode, value, timeline });
}
