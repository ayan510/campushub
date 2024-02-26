import React, { useState, useContext, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, push, onValue, update } from 'firebase/database';
import { db } from './firebase';
import { Button, Form, Input, Header, Segment, Modal, Icon, Message, List } from 'semantic-ui-react';
import { MyContext } from '../App';

const UserPage = () => {
  const { user } = useContext(MyContext);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [classValue, setClassValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    });
  }, []);

  const handleStudentNameChange = (e) => setStudentName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleClassChange = (e) => setClassValue(e.target.value);

  const handleSubmit = () => {
    if (!studentName || !phone || !classValue) {
      setModalOpen(true);
      return;
    }

    setLoading(true);

    const newUserPageRef = push(ref(db, 'students'), {
      studentName,
      phone,
      class: classValue,
      status: 'Pending'
    });
    console.log('Student added:', newUserPageRef.key);

    setStudentName('');
    setPhone('');
    setClassValue('');
    setLoading(false);
  };

  const handleApprove = (studentId) => {
    update(ref(db, `students/${studentId}`), { status: 'Approved' });
  };

  const handleReject = (studentId) => {
    update(ref(db, `students/${studentId}`), { status: 'Rejected' });
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Segment padded='very' raised>
        <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Add Student</Header>
        <Form onSubmit={handleSubmit}>
          <Form.Field
            control={Input}
            label='Student Name'
            placeholder='Student Name'
            value={studentName}
            onChange={handleStudentNameChange}
            style={{ maxWidth: '300px' }}
          />
          <Form.Field
            control={Input}
            label='Phone'
            placeholder='Phone'
            value={phone}
            onChange={handlePhoneChange}
            style={{ maxWidth: '300px' }}
          />
          <Form.Field
            control={Input}
            label='Class'
            placeholder='Class'
            value={classValue}
            onChange={handleClassChange}
            style={{ maxWidth: '300px' }}
          />
          <Button loading={loading} color='teal' type='submit' primary>Add Student</Button>
        </Form>
      </Segment>
      <Segment>
        <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Status</Header>
        <List divided relaxed>
          {students.map(student => (
            <List.Item key={student.id}>
              <List.Content>
                <List.Header>{student.studentName}</List.Header>
                <List.Description>
                  <p><strong>Phone:</strong> {student.phone}</p>
                  <p><strong>Class:</strong> {student.class}</p>
                  <p><strong>Status:</strong> {student.status}</p>
                  {user.isAdmin && (
                    <Button.Group>
                      <Button color='green' onClick={() => handleApprove(student.id)}>Approve</Button>
                      <Button.Or />
                      <Button color='red' onClick={() => handleReject(student.id)}>Reject</Button>
                    </Button.Group>
                  )}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size='tiny'
        centered
      >
        <Modal.Header>Missing Details</Modal.Header>
        <Modal.Content>
          <p>Please fill in all fields before adding a Student.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>OK</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default UserPage;
