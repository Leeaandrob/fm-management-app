import { Stack, Typography, Container, Box, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import inviteImage from 'assets/images/invite/cwok_casual_19.webp';
import { useState } from 'react';
import { API } from 'utils/api';
import { showError, showSuccess } from 'utils/common';

const InviteCard = () => {
  const theme = useTheme();
  const [inviteUl, setInviteUrl] = useState('');

  const handleInviteUrl = async () => {
    if (inviteUl) {
      navigator.clipboard.writeText(inviteUl);
      showSuccess(`Invitation link copied to clipboard`);
      return;
    }
    const res = await API.get('/api/user/aff');
    const { success, message, data } = res.data;
    if (success) {
      let link = `${window.location.origin}/register?aff=${data}`;
      setInviteUrl(link);
      navigator.clipboard.writeText(link);
      showSuccess(`Invitation link copied to clipboard`);
    } else {
      showError(message);
    }
  };

  return (
    <Box component="div">
      <SubCard
        sx={{
          background: theme.palette.primary.dark
        }}
      >
        <Stack justifyContent="center" alignItems={'flex-start'} padding={'40px 24px 0px'} spacing={3}>
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={inviteImage} alt="invite" width={'250px'} />
          </Container>
        </Stack>
      </SubCard>
      <SubCard
        sx={{
          marginTop: '-20px'
        }}
      >
        <Stack justifyContent="center" alignItems={'center'} spacing={3}>
          <Typography variant="h3" sx={{ color: theme.palette.primary.dark }}>
            Invite Rewards
          </Typography>
          <Typography variant="body" sx={{ color: theme.palette.primary.dark }}>
            Share your invitation link, invite friends to register, and get rewards!
          </Typography>

          <OutlinedInput
            id="invite-url"
            label="Invitation Link"
            type="text"
            value={inviteUl}
            name="invite-url"
          />
       </Stack>
     </SubCard>
   </Box>
  );
};

export default InviteCard;"placeholder="Click to generate invitation link"
            endAdornment={
              <InputAdornment position="end">
                <Button variant="contained" onClick={handleInviteUrl}>
                  {inviteUl ? 'Copy' : 'Generate'}
                </Button>
              </InputAdornment>
            }
            aria-describedby="helper-text-channel-quota-label"
            disabled={true}
          />
        </Stack>
      </SubCard>
    </Box>
  );
};

export default InviteCard;".