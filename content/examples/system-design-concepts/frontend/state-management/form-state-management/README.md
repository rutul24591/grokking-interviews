# Form State Management Examples

## Example 1: React Hook Form with Zod

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    await api.signup(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

## Example 2: Multi-Step Form with React Hook Form

```javascript
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

function MultiStepForm() {
  const [step, setStep] = useState(0);
  const methods = useForm({
    defaultValues: {
      personal: { name: '', email: '' },
      address: { street: '', city: '', zip: '' },
      payment: { cardNumber: '', expiry: '' },
    },
  });

  const steps = [PersonalStep, AddressStep, PaymentStep];
  const CurrentStep = steps[step];

  const next = async () => {
    const fields = ['personal', 'address', 'payment'][step];
    const valid = await methods.trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StepIndicator current={step} total={steps.length} />
        <CurrentStep />
        {step > 0 && <button type="button" onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < steps.length - 1 ? (
          <button type="button" onClick={next}>Next</button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
    </FormProvider>
  );
}

function PersonalStep() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <input {...register('personal.name', { required: 'Name is required' })} />
      <input {...register('personal.email', { required: 'Email is required' })} />
    </div>
  );
}
```

## Example 3: Controlled Form with useState (Simple Cases)

```javascript
function SimpleContactForm() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.message.trim()) newErrors.message = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      api.sendMessage(form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <textarea name="message" value={form.message} onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
}
```
