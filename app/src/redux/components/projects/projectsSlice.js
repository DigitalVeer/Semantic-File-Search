import { createSlice } from '@reduxjs/toolkit'

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    data: [],
    activeId: null,
  },
  reducers: {
    setProjects(state, action) {
      return { data: action.payload, activeId: '' }
    },

    resetProjects: () => ({
      data: [],
      activeId: null,
    }),

    addProject(state, action) {
      let date = new Date()
      let newProject = {
        _id: window.crypto.randomUUID(),
        activeVersion: null,
        isChanged: true,
        isLocalFiles: true,
        isRemoteFiles: false,
        projectName: action.payload.projectName,
        artistName: action.payload.user.artistName,
        createdAt: date.toISOString(),
        date: date.toLocaleDateString('en-GB'),
        time: date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        lastModified: date.toISOString(),
        collaborators: [],
        tags: [],
        artWork: null,
        bounces: [],
        samples: [],
        versions: [],
      }

      state.data.push(newProject)
    },

    appendProject(state, action) {
      state.data.push(action.payload)
    },

    appendLocalProject(state, action) {
      let project

      project = state.data.find((project) => project._id === action.payload._id)

      if (project)
        Object.assign(project, { ...action.payload, isLocalFiles: true })
    },

    appendRemoteProject(state, action) {
      let project

      project = state.data.find((project) => project._id === action.payload._id)

      if (!project) {
        project = state.data.find(
          (project) => project.projectName === action.payload.projectName
        )
      }

      if (project)
        Object.assign(project, { ...action.payload, isRemoteFiles: true })
      else {
        console.log('not loaded from local')
        state.data.push({
          ...action.payload,
          isLocalFiles: false,
          isRemoteFiles: true,
        })
      }
    },

    updateProject(state, action) {
      let project

      if (action.payload.projectName)
        project = state.data.find(
          (project) => project.projectName === action.payload.projectName
        )
      else
        project = state.data.find(
          (project) => project._id === action.payload._id
        )

      if (project) {
        Object.assign(project, { ...project, ...action.payload.data })
        project.isChanged = project.isChanged

        if (!project.isLocalFiles && !project.isRemoteFiles) {
          state.data = state.data.filter(
            (storedProject) => storedProject._id !== project._id
          )
          if (state.data.length === 0) state.activeId = null
        }
      }

      if (action.payload.data._id) state.activeId = action.payload.data._id
    },

    removeProjectByPath(state, action) {
      state.data = state.data.filter(
        (project) => project.path !== action.payload
      )
      if (state.data.length === 0) state.activeId = null
    },

    removeProjectById(state, action) {
      state.data = state.data.filter(
        (project) => project._id !== action.payload
      )
      if (state.data.length === 0) state.activeId = null
    },

    setActiveProject(state, action) {
      state.activeId = action.payload
    },

    setIsProjectChanged(state, action) {
      const project = state.data.find(
        (project) => project.path === action.payload.path
      )
      if (project) {
        project.isChanged = action.payload.data
      }
    },

    setLastModified(state, action) {
      const project = state.data.find(
        (project) => project.projectName === action.payload.projectName
      )
      if (project) {
        project.lastModified = action.payload.data
      }
    },

    setArtWork(state, action) {
      const project = state.data.find(
        (project) => project._id === state.activeId
      )
      if (project) {
        project.artWork = action.payload
      }
    },

    addSample(state, action) {
      const project = state.data.find(
        (project) => project.projectName === action.payload.projectName
      )

      console.log('project', project)
      if (project) {
        project.samples.push({
          title: action.payload.path.replace(/^.*[\\\/]/, ''),
          path: action.payload.path,
        })
        project.isChanged = true
        project.isLocalFiles = true
      }
    },

    removeSample(state, action) {
      const project = state.data.find(
        (project) => project.projectName === action.payload.projectName
      )

      if (project) {
        project.samples = project.samples.filter(
          (sample) => sample.path !== action.payload.path
        )
        project.isChanged = true
        project.isLocalFiles = true
      }
    },

    addBounce(state, action) {
      const project = state.data.find(
        (project) => project.projectName === action.payload.projectName
      )
      if (project) {
        project.bounces.push({
          title: action.payload.path.replace(/^.*[\\\/]/, ''),
          path: action.payload.path,
        })
        project.isChanged = true
        project.isLocalFiles = true
      }
    },

    removeBounce(state, action) {
      const project = state.data.find(
        (project) => project.projectName === action.payload.projectName
      )
      if (project) {
        project.bounces = project.bounces.filter(
          (bounce) => bounce.path !== action.payload.path
        )
        project.isChanged = true
        project.isLocalFiles = true
      }
    },

    addTagName(state, action) {
      const project = state.data.find(
        (project) => project._id === action.payload.id
      )

      if (project) {
        project.tags.push(action.payload.value)
      }
    },
  },
})

// Export actions
export const {
  setProjects,
  addProject,
  removeProjectByPath,
  removeProjectById,
  setIsProjectChanged,
  setActiveProject,
  setArtWork,
  addTagName,
  addSample,
  removeSample,
  addBounce,
  removeBounce,
  setLastModified,
  appendProject,
  updateProject,
  appendLocalProject,
  appendRemoteProject,
  resetProjects,
} = projectsSlice.actions

// Export reducer
export default projectsSlice.reducer
