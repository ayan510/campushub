import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, onValue, update, remove, push, set } from 'firebase/database';
import { db } from './firebase';
import { Button, Header, Segment, Modal, Table, Input, Icon } from 'semantic-ui-react';

const AdminPage = () => {
  const [list, setList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null)
  const [student, setStudent] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [father, setFather] = useState('');

  useEffect(() => {
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setList(data);
      } else {
        setList([]);
      }
    });
  }, []);

  const handleStudentClick = (id) => {
    setStudent(list[id].student);
    setPhone(list[id].phone);
    setGrade(list[id].grade);
    setFather(list[id].father);
    setEditId(id)
    setModalOpen(true);
  };

  const handleSaveEdit = () => {
    update(ref(db, `students/${editId}`), { student, phone, grade, father });
    closeModal()
  };

  const handleApprove = () => {
    if (editId) {
      set(ref(db, `students/${editId}/status/`), true);
      closeModal()
    }
  };

  const handleReject = () => {
    if (editId) {
      set(ref(db, `students/${editId}/status/`), false);
      closeModal()
    }
  };

  const handleDelete = () => {
    if (editId) {
      remove(ref(db, `students/${editId}`));
      closeModal()
    }
  };

  function closeModal() {
    setStudent('')
    setPhone('')
    setGrade('')
    setFather('')
    setEditId(null)
    setModalOpen(false)
  }

  function addItem() {
    push(ref(db, 'students'), { student, grade, phone, father })
    closeModal()
  }

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Student Applications</Header>
      <Button color='green' onClick={() => setModalOpen(true)}>Add New Student</Button>
      <Segment>
        <Table celled selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Student Name</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Class</Table.HeaderCell>
              <Table.HeaderCell>Father Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(list).map(item => (
              <Table.Row
                positive={item[1].status === true}
                negative={item[1].status === false}
                key={item[0]}
                onClick={() => handleStudentClick(item[0])}
              >
                <Table.Cell>{item[1].student}</Table.Cell>
                <Table.Cell>{item[1].phone}</Table.Cell>
                <Table.Cell>{item[1].grade}</Table.Cell>
                <Table.Cell>{item[1].father}</Table.Cell>
                <Table.Cell>
                  {item[1].status === true && <Icon name='check' />}
                  {item[1].status === false && <Icon name='close' />}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
      <Modal open={modalOpen} closeOnDimmerClick={false} onClose={closeModal} size='small' centered>
        <Modal.Header>Student Details</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label='Student Name'
            value={student}
            onChange={(e) => {
              setStudent(e.target.value);
            }}
          />
          <br />
          <Input
            fluid
            label='Phone'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <br />
          <Input
            fluid
            label='Class'
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
            }}
          />
          <br />
          <Input
            fluid
            label='Father'
            value={father}
            onChange={(e) => {
              setFather(e.target.value);
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          {!editId ?
            <Button color='green' onClick={addItem}>Add</Button>
            :
            <>
              {editId && (
                <Button color='blue' onClick={handleSaveEdit}>Save</Button>
              )}
              <Button color='green' onClick={handleApprove}>Approve</Button>
              <Button color='yellow' onClick={handleReject}>Reject</Button>
              <Button color='red' onClick={handleDelete}>Delete</Button>
            </>
          }
          <Button color='black' onClick={closeModal}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AdminPage;
