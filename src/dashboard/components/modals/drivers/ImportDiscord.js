import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Avatar } from 'primereact/avatar';
import { FaDiscord } from 'react-icons/fa';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { Dropdown } from "primereact/dropdown";
import { Chip } from 'primereact/chip';

import '../ModalForms.css';

export const ImportDiscord = (props) => {
  const navigate = useNavigate();
    const [displayBasic, setDisplayBasic] = useState(false);
    const { sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    const [importTags, setImportTags] = useState(true);
    const [useNicknames, setUseNicknames] = useState(false);

    const { item, options, leagueMembers } = props;

    const leagueId = useParams().leagueId;
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const [discordMembers, setDiscordMembers] = useState();

    useEffect(() => {
      const fetchMembers = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/discord/${leagueId}/members`
          );
          setDiscordMembers(responseData.members);
        } catch (err) {} 
      };
      fetchMembers();
    }, [sendRequest]);

    const membersSubmitHandler = async event => {
      console.log(discordMembers);
      navigate(0);
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/drivers/discord-import`, 
              'POST', 
              JSON.stringify({ drivers: discordMembers }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    };

    const nicknamesChangeHandler = async event => {
      setUseNicknames(event);

      setDiscordMembers(
        discordMembers.map((member) => {
          console.log(member);
          let preferredName;
          if (event == true){
            if (member.nickname == null){
              preferredName = member.username
            } else {
              preferredName = member.nickname
            }
          } else {
            preferredName = member.username
          }

          return {
            avatar: member.avatar,
            id: member.id,
            link: member.link,
            nickname: member.nickname,
            preferredName: preferredName,
            roles: member.roles,
            tags: member.tags,
            username: member.username
          }
        })
      );
    };

    const importTagsChangeHandler = async event => {
      setImportTags(event);

      setDiscordMembers(
        discordMembers.map((member) => {

          let tags;
          if (event == true){
            tags = member.tags;
          } else {
            tags = [];
          }

          return {
            avatar: member.avatar,
            id: member.id,
            link: member.link,
            nickname: member.nickname,
            preferredName: member.preferredName,
            roles: member.roles,
            tags: tags,
            username: member.username
          }
        })
      );
    };

    const header = (
      <div className="table-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <p style={{marginRight:'5px'}}>Use Nicknames?</p>
          <InputSwitch checked={useNicknames} onChange={(e) => nicknamesChangeHandler(e.value)} label='Use Nicknames?' style={{marginRight:'5px'}}/>
          <p style={{marginRight:'5px'}}>Import Tags?</p>
          <InputSwitch checked={importTags} onChange={(e) => importTagsChangeHandler(e.value)} label='Use Nicknames?' style={{marginRight:'5px'}}/>
        </div>
        <div>
          <Button label='Submit' onClick={membersSubmitHandler}/>
        </div>
      </div>
  );

    const rowIndexTemplate = (rowData, props) => {
      let index = parseInt(props.rowIndex + 1, 10);
      return (
        <React.Fragment>
          <span>{index}</span>
        </React.Fragment>
      );
    };

    const avatarTemplate = (member) => {

      let preferredName;
      if(useNicknames == true){
        if(member.nickname == null){
          preferredName = member.username;
        } else {
          preferredName = member.nickname;
        }
      } else {
        preferredName = member.username;
      };

        return (
            <React.Fragment>
                <Avatar image={member.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
                <span className="image-text" style={{color:'#E513E2'}}>{preferredName}</span>
            </React.Fragment>
        );
    };

    const linkTemplate = (option) => {
      if(option.link){
        return <BiLink style={{color:'green'}}/>
      } else {
        return <BiUnlink style={{color:'gray'}}/>
      }

    };

    const linkEditor = (options) => {
      return (
          <Dropdown value={options.value} options={leagueMembers} optionLabel="username" optionValue="id"
              onChange={(e) => options.editorCallback(e.value)} placeholder="Link"
              itemTemplate={(option) => { return <span>{option.username}</span> }} 
              showClear={true} filter={true}/>
      );
    }

    const onRowEditComplete = (e) => {
        let _discordMembers = [...discordMembers];
        let { newData, index } = e;

        _discordMembers[index] = newData;
        setDiscordMembers(_discordMembers);
    };

    const onDeleteMember = (e) => {
      let index = e.rowIndex;
      let _discordMembers = [...discordMembers];
      _discordMembers.splice(index, 1);

      setDiscordMembers(_discordMembers);
  };

    const actionsTemplate = (props) => {
      const deleteMember = () => onDeleteMember(props);
      return <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel"  onClick={deleteMember}/>
    };

    const avatarEditor = (options) => {
      const driver = options.rowData;
        return ( 
          <React.Fragment>
            <Avatar image={driver.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
            <span className="image-text" style={{color:'#E513E2'}}>{driver.preferredName}</span>
          </React.Fragment>
        );
    };

    const tagsTemplate = (options) => {
      let tagsChips = options.tags.map((tag) => { 
        return ( <Chip key={`${options.id}.${tag}`} label={tag} style={{marginRight:'5px', color:'#54D5E1', fontSize:'5px', padding:'3px'}} /> )  
      });
        return ( tagsChips );
    };

    const tagsEditor = (options) => {
      let tagsChips = options.value.map((tag) => { 
        return ( <Chip label={tag} style={{marginRight:'5px', color:'#54D5E1', fontSize:'5px', padding:'3px'}} removable={true}/> )  
      });
        return ( tagsChips );
    };

    if (options && item) {
      return (
          <div className="dialog-demo">

            {discordMembers && (
              <>
                <a className={options.className} target={item.target} onClick={() => onClick('displayBasic')} >
                  <FaDiscord style={{marginRight:'10px'}}/>
                  <span className={options.labelClassName}>{item.label}</span>
                </a>

                <Dialog visible={displayBasic} style={{ width: '70rem', height:'50rem' }} onHide={() => onHide('displayBasic')} header='Import From Discord'>

                  <DataTable value={discordMembers} dataKey="id" responsiveLayout="scroll" editMode="row" onRowEditComplete={onRowEditComplete} header={header} size='small' loading={!discordMembers}>
                    <Column field="Index" header="" style={{ width: "2rem" }} body={rowIndexTemplate} />
                    <Column field="link" header="Link" body={linkTemplate} editor={(options) => linkEditor(options)}/>
                    <Column field="avatar" header="Driver" body={avatarTemplate} editor={(options) => avatarEditor(options)} />
                    <Column field="nickname" header="Nickname" />
                    <Column field="tags" header="Tags" body={tagsTemplate} editor={(options) => tagsEditor(options)} />
                    {/*<Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
            <Column body={actionsTemplate} />*/}
                  </DataTable>
                  
                </Dialog>
              </>
            )}
          </div>
      )
    }
};