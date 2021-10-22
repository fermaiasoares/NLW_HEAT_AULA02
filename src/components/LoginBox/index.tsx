import { useContext } from 'react';

import { AuthContext } from '../../context/auth';

import styles from './styles.module.scss';

import { VscGithubInverted } from 'react-icons/vsc';

export function LoginBox() {
  const {signInUrl} = useContext(AuthContext);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilher sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGitHub}>
        <VscGithubInverted size={24} />
        Entrar com GitHub
      </a>
    </div>
  )
}