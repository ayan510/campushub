import React, { createContext, useEffect, useState } from 'react';
import { auth } from './comp/firebase';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Button, Grid, Icon, Card } from 'semantic-ui-react';
import Admin from './comp/AdminPage';
import User from './comp/UserPage';

export const MyContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('admin');

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribeAuthState();
    };
  }, []);

  function doLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  function doLogout() {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div style={{ marginTop: '20px', marginLeft: '20px', position: 'relative' }}>
      <MyContext.Provider value={{ user, setUser }}>
        {user ? (
          <div>
            <Button className='logout' color='red' onClick={doLogout} style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <Icon name='sign-out' />
              Logout
            </Button>
            {user && (user.email === 'smdabdulla510@gmail.com' || user.email === 'mdsufyan7@gmail.com') ? (
              <div>
                <Button
                  className={activePage === 'admin' ? 'active' : ''}
                  onClick={() => handlePageChange('admin')}
                >
                  Admin
                </Button>
                <Button
                  className={activePage === 'user' ? 'active' : ''}
                  onClick={() => handlePageChange('user')}
                >
                  Student
                </Button>
                {activePage === 'admin' && <Admin />}
                {activePage === 'user' && <User />}
              </div>
            ) : (
              <User />
            )}
          </div>
        ) : (
          <Grid centered style={{ marginTop: '50px' }}>
            <Grid.Row>
              <Card style={{ width: '400px', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                <Card.Content>
                  <Card.Header>Welcome to CampusHub</Card.Header>
                  <Card.Description>
                    <p>We welcome you to CampusHub, your platform for submitting applications.</p>
                    <p>Please log in to submit your applications.</p>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Row>
            <Grid.Row>
              <Button color='green' onClick={doLogin} style={{ marginTop: '20px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                <Icon name='google' />
                Login with Google
              </Button>
            </Grid.Row>
          </Grid>
        )}
      </MyContext.Provider>
    </div>
  );
}
