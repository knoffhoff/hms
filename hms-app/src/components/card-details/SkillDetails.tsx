import React, { useEffect, useState } from 'react';
import { Button, Card, Group, Modal, Text } from '@mantine/core';
import { useMsal } from '@azure/msal-react';

import { getSkillDetails, removeSkill } from '../../actions/SkillActions';
import { DELETE_BUTTON_COLOR, JOIN_BUTTON_COLOR } from '../../common/colors';
import { styles } from '../../common/styles';
import { Skill } from '../../common/types';
import SkillForm from '../input-forms/SkillForm';



type IProps = {
    skillId: string
}

const SkillDetails = (props: IProps): React.ReactElement => {
    const { instance } = useMsal();
    const { classes } = styles();
    const { skillId } = props;
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [skillData, setSkillData] = useState({
        id: '',
        name: '',
        description: '',
    } as Skill);

    const loadSelectedSkill = (): void => {
        getSkillDetails(instance, skillId).then(
            (data) => {
                setIsError(false);
                setIsLoading(false);
                setSkillData(data);
            },
            () => {
                setIsError(true);
                setIsLoading(false);
            }
        );
    };

    const deleteSelectedSkill = () => {
        removeSkill(instance, skillId).then(() => {
            setDeleteModalOpened(false)
        });
    };

    useEffect(() => {
        loadSelectedSkill();
        setIsLoading(true);
    }, []);

    const deleteModal = (
        <Modal
            centered
            opened={deleteModalOpened}
            onClose={() => setDeleteModalOpened(false)}
            withCloseButton={false}
        >
            <Text className={classes.text}>
                Are you sure you want to delete this skill?
            </Text>
            <Text className={classes.title}>Name: {skillData.name}</Text>
            {!isLoading && (
                <Button
                    style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                    onClick={() => deleteSelectedSkill()}
                >
                    Yes delete this skill
                </Button>
            )}
            <Text className={classes.text}>
                (This window will automatically close as soon as the skill is
                deleted)
            </Text>
        </Modal>
    );

    const editModal = (
        <Modal
            centered
            opened={editModalOpened}
            onClose={() => setEditModalOpened(false)}
            withCloseButton={false}
        >
            <Text className={classes.title}>Edit Skill</Text>
            <SkillForm skillId={skillId} context={'edit'} />
            {isLoading && <div>Loading...</div>}
            <Text className={classes.text}>
                (This window will automatically close as soon as the skill is
                changed)
            </Text>
        </Modal>
    );

    return (
        <>
            {isError && !isLoading && (
                <div>
                    <Text className={classes.title}>Error loading Skill</Text>
                    <Text className={classes.text}>something went wrong.</Text>
                </div>
            )}
            {isLoading && !isError && (
                <div>
                    <Text className={classes.text}>Skill details are loading...</Text>
                </div>
            )}

            {!isLoading && !isError && (
                <Card withBorder className={classes.card}>
                    <Card.Section className={classes.borderSection}>
                        <Text className={classes.title}>{skillData.name}</Text>
                        <Text className={classes.text}>ID: {skillData.id}</Text>
                    </Card.Section>
                    <Card.Section className={classes.borderSection}>
                        <Text className={classes.label}>Description:</Text>
                        <Text className={classes.text}>{skillData.description}</Text>
                    </Card.Section>
                    <Card.Section className={classes.borderSection}>
                        <Group position='left' mt='xl'>
                            {deleteModal}
                            <Button
                                style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                                onClick={() => setDeleteModalOpened(true)}
                            >
                                Delete
                            </Button>
                            {editModal}
                            <Button
                                style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                                onClick={() => setEditModalOpened(true)}
                            >
                                Edit
                            </Button>
                        </Group>
                    </Card.Section>
                </Card>
            )}
        </>
    );
};

export default SkillDetails;