import React, { useState, useContext, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, push, onValue, update } from 'firebase/database';
import { db } from './firebase';
import { Button, Form, Input, Header, Segment, Modal, Table } from 'semantic-ui-react';
import { MyContext } from '../App';

const UserPage = () => {
  const { user } = useContext(MyContext);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [classValue, setClassValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const isAdmin = user && (user.email === 'smdabdulla510@gmail.com' || user.email === 'mdsufyan7@gmail.com');

  useEffect(() => {
    const studentsRef = ref(db, 'students/' + user.uid);
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
  }, [user.uid]);

  const handleStudentNameChange = (e) => setStudentName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleClassChange = (e) => setClassValue(e.target.value);

  const handleSubmit = () => {
    if (!studentName || !phone || !classValue) {
      setModalOpen(true);
      return;
    }

    setLoading(true);

    const newUserPageRef = push(ref(db, 'students/' + user.uid), {
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
    update(ref(db, `students/${user.uid}/${studentId}`), { status: 'Approved' });
  };

  const handleReject = (studentId) => {
    update(ref(db, `students/${user.uid}/${studentId}`), { status: 'Rejected' });
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {(isAdmin || students.length === 0) && (
        <Segment padded='very' raised style={{ marginTop: '60px' }}>
          <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Application for Student Registration</Header>
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
            <Button loading={loading} color='teal' type='submit' primary>{isAdmin ? 'Add Student' : 'Save'}</Button>
          </Form>
        </Segment>
      )}

      {students.length > 0 && (
        <Segment style={{ marginTop: '60px' }}>
          <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Status</Header>
          <Table celled unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                {isAdmin && <Table.HeaderCell>Actions</Table.HeaderCell>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map(student => (
                <Table.Row key={student.id}>
                  <Table.Cell>{student.studentName}</Table.Cell>
                  <Table.Cell>{student.phone}</Table.Cell>
                  <Table.Cell>{student.class}</Table.Cell>
                  <Table.Cell>{student.status}</Table.Cell>
                  {isAdmin && (
                    <Table.Cell>
                      <Button.Group>
                        <Button color='green' onClick={() => handleApprove(student.id)}>Approve</Button>
                        <Button.Or />
                        <Button color='red' onClick={() => handleReject(student.id)}>Reject</Button>
                      </Button.Group>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {students.some(student => student.status === 'Pending') && (
            <p style={{ textAlign: 'center', marginTop: '10px', color: 'gray' }}>{isAdmin ? 'Please Update the Status of Applications' : 'Please wait for CampusHub'}</p>
          )}
        </Segment>
      )}

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
