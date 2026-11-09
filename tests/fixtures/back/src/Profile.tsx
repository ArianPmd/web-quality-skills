import { Link } from 'react-router-dom';
import { BackArrowIcon } from './icons';
export function Profile() {
  return (
    <>
      <Link to="/home">Back</Link>
      <Link to="/settings" aria-label="Back">
        <BackArrowIcon />
      </Link>
    </>
  );
}
