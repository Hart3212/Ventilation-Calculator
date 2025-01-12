import Head from 'next/head';
import InputForm from '../components/InputForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Ventilation Compliance Calculator</title>
      </Head>

      <main>
        <h1>Welcome to the Ventilation Calculator</h1>
        <InputForm />
      </main>
    </div>
  );
}