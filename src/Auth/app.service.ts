export class AppService {


    public async getUsers(): Promise<any> {
        const response = await fetch('https://dev-kgk804vltkl84vk.api.raw-labs.com/engineers');
        return await response.json();
    }

    public async getCourses() {
        const response = await fetch('https://dev-kgk804vltkl84vk.api.raw-labs.com/courses');
        return await response.json();
    }

}