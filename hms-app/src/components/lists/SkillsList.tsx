import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import { styles } from '../../common/styles';
import { SkillPreview } from '../../common/types';
import { getListOfSkills } from '../../actions/SkillActions';
import { Accordion, Button, Card, Group } from '@mantine/core';
import SkillDetails from '../card-details/SkillDetails';
import SkillForm from '../input-forms/SkillForm';


const SkillsList = (): React.ReactElement => {
    const { instance } = useMsal();
    const { classes } = styles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [skillsList, setSkillsList] = useState([] as SkillPreview[]);

    const loadSkills = () => {
        setIsLoading(true);
        getListOfSkills(instance)
            .then((data) => {
                let skills = [] as SkillPreview[];
                if (data && data.skills) {
                    skills = data.skills;
                }
                setSkillsList(skills);
                setIsLoading(false);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadSkills();
    }, []);

    const refreshList = (): void => {
        setIsLoading(true);
        loadSkills();
    };

    const allSkills = skillsList?.map((skill, index) => (
        <Accordion.Item
            key={index}
            label={
                <div>
                    {index + 1}. {skill.name}
                </div>
            }
        >
            <SkillDetails skillId={skill.id.toString()} />
        </Accordion.Item>
    ));

    return (
        <>
            <Card withBorder className={classes.card}>
                <Card.Section className={classes.borderSection}>
                    <Group position='left' mt='xl'>
                        {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
                        {isLoading && <div>Loading...</div>}
                    </Group>
                </Card.Section>
                <Card.Section>
                    <Accordion iconPosition='right'>
                        <Accordion.Item
                            className={classes.borderAccordion}
                            label={'Add Skill'}
                        >
                            <SkillForm
                                context={'new'}
                                skillId={''}
                            />
                        </Accordion.Item>
                        {allSkills}
                    </Accordion>
                </Card.Section>
            </Card>{' '}
        </>
    );
}

export default SkillsList;