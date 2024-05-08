import React, { useEffect, useState } from 'react';
import { Button, Form, Label, Pagination, Popup, Table, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, showError, showSuccess } from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import { renderGroup, renderNumber, renderQuota, renderText } from '../helpers/render';

function renderRole(role) {
  switch (role) {
    case 1:
      return <Label>Regular User</Label>;
    case 10:
      return <Label color='yellow'>Administrator</Label>;
    case 100:
      return <Label color='orange'>Super Administrator</Label>;
    default:
      return <Label color='red'>Unknown Identity</Label>;
  }
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [orderBy, setOrderBy] = useState('');

  const loadUsers = async (startIdx) => {
    const res = await API.get(`/api/user/?p=${startIdx}&order=${orderBy}`);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setUsers(data);
      } else {
        let newUsers = users;
        newUsers.push(...data);
        setUsers(newUsers);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(users.length / ITEMS_PER_PAGE) + 1) {
        // In this case we have to load more data and then append them.
        await loadUsers(activePage - 1, orderBy);
      }
      setActivePage(activePage);
    })();
  };

  useEffect(() => {
    loadUsers(0, orderBy)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, [orderBy]);

  const manageUser = (username, action, idx) => {
    (async () => {
      const res = await API.post('/api/user/manage', {
        username,
        action".});
      const { success, message } = res.data;
      if (success) {
        showSuccess('Operation completed successfully!');
        let user = res.data.data;
        let newUsers = [...users];
        let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
        if (action === 'delete') {
          newUsers[realIdx].deleted = true;
        } else {
          newUsers[realIdx].status = user.status;
          newUsers[realIdx].role = user.role;
        }
        setUsers(newUsers);
      } else {
        showError(message);
      }
    })();
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <Label basic>Activated</Label>;
      case 2:
        return (
          <Label basic color='red'>
            Banned
          </Label>
        );
      default:
        return (
          <Label basic color='grey'>
            Unknown Status
          </Label>
        );
    }
  };

  const searchUsers = async () => {
    if (searchKeyword === '') {
      // if keyword is blank, load files instead.
      await loadUsers(0);
      setActivePage(1);
      setOrderBy('');
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/user/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setUsers(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  const sortUser = (key) => {
    if (users.length === 0) return;
    setLoading(true);
    let sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
      if (!isNaN(a[key])) {
        // If the value is numeric, subtract to sort
        return a[key] - b[key];
      } else {
        // If the value is not numeric, sort as strings
        return ('' + a[key]).localeCompare(b[key]);
      }
    });
    if (sortedUsers[0].id === users[0].id) {
      sortedUsers.reverse();
    }
    setUsers(sortedUsers);
    setLoading(false);
  };const handleOrderByChange = (e, { value }) => {
    setOrderBy(value);
    setActivePage(1);
  };

  return (
    <>
      <Form onSubmit={searchUsers}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='Search user ID, username, display name, and email address ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table basic compact size='small'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('id');
              }}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('username');
              }}
            >
              Username
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('group');
              }}
            >
              Group
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('quota');
              }}
            >
              Statistics
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('role');
              }}
            >
              User Role
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('status');
              }}
            >
              Status
            </Table.HeaderCell>
            <Table.HeaderCell>Operation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,".```javascript
activePage * ITEMS_PER_PAGE
            )
            .map((user, idx) => {
              if (user.deleted) return <></>;
              return (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>
                    <Popup
                      content={user.email ? user.email : 'Email not bound'}
                      key={user.username}
                      header={user.display_name ? user.display_name : user.username}
                      trigger={<span>{renderText(user.username, 15)}</span>}
                      hoverable
                    />
                  </Table.Cell>
                  <Table.Cell>{renderGroup(user.group)}</Table.Cell>
                  {/*<Table.Cell>*/}
                  {/*  {user.email ? <Popup hoverable content={user.email} trigger={<span>{renderText(user.email, 24)}</span>} /> : 'None'}*/}
                  {/*</Table.Cell>*/}
                  <Table.Cell>
                    <Popup content='Remaining Quota' trigger={<Label basic>{renderQuota(user.quota)}</Label>} />
                    <Popup content='Used Quota' trigger={<Label basic>{renderQuota(user.used_quota)}</Label>} />
                    <Popup content='Request Count' trigger={<Label basic>{renderNumber(user.request_count)}</Label>} />
                  </Table.Cell>
                  <Table.Cell>{renderRole(user.role)}</Table.Cell>
                  <Table.Cell>{renderStatus(user.status)}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={() => {
                          manageUser(user.username, 'promote', idx);
                        }}
                        disabled={user.role === 100}
                      >
                        Promote
                      </Button>
                      <Button
                        size={'small'}
                        color={'yellow'}
```"Demote
Delete
Disable
Enable
Edit"<Button size='small' as={Link} to='/user/add' loading={loading}>
                Add a new user
              </Button>
              <Dropdown
                placeholder='Sorting method'
                selection
                options={[
                  { key: '', text: 'Default sorting', value: '' },
                  { key: 'quota', text: 'Sort by remaining quota', value: 'quota' },
                  { key: 'used_quota', text: 'Sort by used quota', value: 'used_quota' },
                  { key: 'request_count', text: 'Sort by request count', value: 'request_count' },
                ]}
                value={orderBy}
                onChange={handleOrderByChange}
                style={{ marginLeft: '10px' }}
              />
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={
                  Math.ceil(users.length / ITEMS_PER_PAGE) +
                  (users.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default UsersTable;