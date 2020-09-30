import Head from "next/head";
import styles from "../styles/Home.module.css";
import Product from "../components/Product";

export default function Home() {
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Detail shots</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Detail shots</h1>
        <Product imageUrl='image.png'/>
      </main>
    </div>
  );
}
